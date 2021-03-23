var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient


router.get('/', function(req, res, next) {


		//Devuelve el ratio entre dos numeros

		let calcularRatio = (num_1, num_2)=>{
		    for(num=num_2; num>1; num--) {
		        if((num_1 % num) == 0 && (num_2 % num) == 0) {
		            num_1=num_1/num
		            num_2=num_2/num
		        }
		    }
		    let ratio = num_1/num_2
		    return ratio;
		}

		//Conección a la DB

		let connectionString = 'mongodb+srv://luna:messi@cluster0.hqnpi.mongodb.net/mutacionesdb?retryWrites=true&w=majority'

		MongoClient.connect(connectionString, { useUnifiedTopology: true })
		.then(client => {
			const db = client.db('mutacionesdb')
			const coleccion = db.collection('mutaciones')

			//Se buscan todos los documentos de la coleccion

			const cursor = coleccion.find().toArray()
			.then(results => {

				//Cuenta la cantidad de mutantes y no mutantes

				let contadorMutantes = 0
				let contadorNoMutantes = 0

				results.map((adn) => {

					if(adn.esMutante){
						contadorMutantes++
					}else{
						contadorNoMutantes++
					}

				});

				let ratio = calcularRatio(contadorMutantes,contadorNoMutantes)

				//Informa el JSON de respuesta

				res.json({count_mutations:contadorMutantes, count_no_mutation: contadorNoMutantes, ratio: ratio })

			})

		})
		.catch(error => console.error(error))

});

module.exports = router;
