var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient

router.post('/', function(req, res, next) {

	let matriz = req.body.dna


	let mutacionesDiagonalesDerechaAIzquierda = (dna)=>{

		let diagonalesSuperiores = (dna,index)=>{

				let fila = ""

				for (let i=0;i<=dna.length-index-1;i++){

					if(fila!=""){
						fila+=dna[i][i+index]
					}else{
						fila=dna[i][i+index]
					}
				}

				return fila
				
		}

		let diagonalesInferiores = (dna,index)=>{

				let fila = ""

				for (let i=0;i<=dna.length-index-1;i++){

					if(fila!=""){
						fila+=dna[i+index][i]
					}else{
						fila=dna[i+index][i]
					}
				}
				return fila
		}

		//Se guardan las diagonales superiores e inferiores de la matriz, 
		//en una nueva matriz, para utilizar el metodo mutacionesHorizontales

		let matrizDeDiagonales = []

		dna.map((c,index)=>{
			matrizDeDiagonales.push(diagonalesSuperiores(dna,index))
		})

		dna.map((f,index)=>{
			matrizDeDiagonales.push(diagonalesInferiores(dna,index))
		})

		matrizDeDiagonales.shift()

		return mutacionesHorizontales(matrizDeDiagonales)

	}



	let mutacionesDiagonalesIzquierdaADerecha = (dna)=>{

		let matrizDeDiagonales = new Array(2*dna.length-1)

		for(let i=0; i<matrizDeDiagonales.length; ++i){

			matrizDeDiagonales[i] = ""

			for(let j=Math.min(i, dna.length-1); j>Math.max(-1, i-dna.length); --j){

				if(matrizDeDiagonales[i]!=""){
					matrizDeDiagonales[i]+=dna[j][i-j]
				}else{
					matrizDeDiagonales[i]=dna[j][i-j]
				}

			}
			
		}

		return mutacionesHorizontales(matrizDeDiagonales)

	}

	//Devuelve la cantidad de secuencias oblicuas en la matriz

	let mutacionesDiagonales = (dna) =>{

		return (mutacionesDiagonalesIzquierdaADerecha(dna)+mutacionesDiagonalesDerechaAIzquierda(dna))

	}

	//Devuelve la cantidad de secuencias verticales en la matriz

	let mutacionesVerticales = (dna) =>{

		let matrizNueva = []

		//Se da rota la matriz, para luego usar el metodo mutacionesHorizontales

		dna.map((fila,indexFila) => {

			fila.split("").map((elemento,indexElemento) => {

				if(indexFila==0){
					matrizNueva[indexElemento]=elemento
				}else{
					matrizNueva[indexElemento]+=elemento
				}

			});

		});

		return mutacionesHorizontales(matrizNueva)

	}



	//Devuelve la cantidad de secuencias horizontales en la matriz

	let mutacionesHorizontales = (dna) =>{

		let contadorMutaciones = 0

		dna.map((fila) => {

			let anteriorElemento = ""

			let contadorLetras = 0

			let contadorSecuencias = 0

			//Se cuentan las secuencias horizontales
			//El contadorSecuencias guarda la cantidad de secuencias en una misma fila
			//Mientras que contadorLetras guarda la cantidad de letras de la actual secuencia

			fila.split("").map((elemento,index) => {

				if(elemento==anteriorElemento){

					contadorLetras++

					if((fila.split("").length==index+1)&&(contadorLetras>=4)){
						contadorSecuencias++
					}

				}else{

					if(contadorLetras>=4){
						contadorSecuencias++
					}

					anteriorElemento = elemento

					contadorLetras = 1

				}
				
			});

			contadorMutaciones += contadorSecuencias

		});

		return contadorMutaciones

	}




	//Verifica si la matriz es valida

	let esValido = (dna) =>{

		let adnValido=true

		//Se ve cada elemento de la matriz, buscando letras erroneas. 
		//Si esta todo bien, se devuelve true

		dna.map((fila) => {
			fila.split("").map((elemento) => {
				const valoresValidos = ["A","T","C","G"]
				let elementoValido = false
				valoresValidos.map((letraValida) => {

					if(letraValida==elemento){
						elementoValido=true
					}

				});
				if(!elementoValido){
					adnValido=false
				}

			});
		});

		return adnValido

	}

	//Informa si el ADN es mutante, o no

	let hasMutation = (dna) =>{

		return (mutacionesHorizontales(dna)+mutacionesVerticales(dna)+mutacionesDiagonales(dna)>1)

	}

	//Envia como response, los codigos HTTP. Segun si es mutante, o no

	let enviarStatus = (esMutante) =>{

		if(esMutante){
			res.status(200).send({
				message: "Mutacion verificada"
			});
		}else{
			res.status(403).send({
				message: "No hay mutacion"
			});
		}

	}

	//Registra en la base de datos de MongoDB Atlas los ADN. Luego envia los codigos de status.

	let registrarBaseDeDatos = (connectionString,esMutante) =>{

		MongoClient.connect(connectionString, { useUnifiedTopology: true })
		.then(client => {
			const db = client.db('mutacionesdb')
			const coleccion = db.collection('mutaciones')

			const dna = matriz.join()

			const cursor = coleccion.find({ adn: dna }).toArray()
			.then(results => {

				//Si ya existe un registro con ese ADN, no se guarda.

				if(results.length == 0){

					coleccion.insertOne({ adn: dna, esMutante: esMutante })
					.then(result => {

						enviarStatus(esMutante)

					})
					.catch(error => console.error(error))

				}else{
					enviarStatus(esMutante)
				}

			})

		})
		.catch(error => console.error(error))

	}

	if(!esValido(matriz)||(!req.body)){
		res.status(403).send({
			message: "ADN NO VALIDO"
		});
	}else{

		//String con la informacion de la base de datos

		let connectionString = 'mongodb+srv://luna:messi@cluster0.hqnpi.mongodb.net/mutacionesdb?retryWrites=true&w=majority'

		registrarBaseDeDatos(connectionString,hasMutation(matriz))

	}


});

module.exports = router;
