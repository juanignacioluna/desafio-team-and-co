#Mutaciones de ADN en Node y MongoDB

## Como Usarlo

Primero instale los modulos de node con el siguiente comando:

`npm install` 

Luego para ejecutar el proyecto de forma local utilice:

`nodemon` 


La URL local va a ser: `'http://localhost:8050/'` 

La URL de la API del deploy es: `' https://adn-mutante.herokuapp.com '`

## Endpoints

1. /mutation. Usando el metodo POST, podremos verificar si un ADN es valido. 
Ademas de guardarlo en la base de datos. El formato del body: 
`"{dna:["ATGCGA","CAGTGC","TTATTT","AGACGG","GCCACA","TCACTG"]}"`

2. /stats. Usando el metodo GET, se devuelve un JSON con las estadisticas de los 
ADNS ingresados. El formato de respuesta es el siguiente: 
`"{count_mutations:1,count_no_mutation:2,ratio:0.5}"`

## Nota importante

Para que suceda una mutación deben haber mas de una sucesión de 4 letras iguales (o vertical, o horizontal, o oblicuas). Por ende por lo menos deben haber `2 sucesiones` , con 1 no basta. (más de una).

