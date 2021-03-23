import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, ChartDataSets, ChartData, ChartOptions } from 'chart.js';

//Interfaz con la estructura de un DataSet

interface DataSetObject {
  label: string;
  fill: boolean;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth : number;
  yAxisID : string;
  pointHoverRadius : number;
  pointHoverBackgroundColor : string;
  pointHoverBorderColor : string;
  pointHoverBorderWidth : number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  @ViewChild('grafica', { static: true }) graficaREF: ElementRef;
  private datasets: DataSetObject[];
  private dataFanPage: number[];
  private dataEngaged: number[];

  ngOnInit(){

    this.datasets=[]
    this.dataFanPage=[292.67, 292.82, 292.54, 292.54, 292.95, 292.41, 292.68, 292.27, 292.41, 292.21, 292.37, 292.50]
    this.dataEngaged=[21.43, 21.43, 26.78, 16.07, 16.07, 10.71, 10.71, 21.43, 5.36, 10.71, 5.36, 10]

    //Se crean los dos datasets

    this.createDataSet('Fan page',this.dataFanPage,'#F8CB1C')
    this.createDataSet('Engaged users',this.dataEngaged,'#4C4CD8')


    // CHARTDATA
    const data : ChartData = {
      labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: this.datasets
    }


    // CHARTOPTIONS
    const options : ChartOptions = {
      responsive : false,
      legend : {
        display : false
      },
      hover : {
        mode : 'x',
        intersect : false
      },
      onHover: function (e, line) {

        //Si el usuario activa el hover del chart,
        //se colorea el label de X, que concuerda con la posicion en X del mouse.
        //Por otro lado se calcula la menor distancia en los labels de Y. 

        if(line.length!=0){

          const lineX = line[0]._xScale._labelItems
          const lineY = line[0]._yScale._labelItems
          let menorDistancia = Infinity
          let labelMenorDistancia

          for(let i=0;i<lineX.length;i++){

            if(line[0]._model.x==lineX[i].x){
              lineX[i].font = { color : '#F8CB1C'}
            }else{
              lineX[i].font = { color : '#EBEBEB'}
            }
            
          }

          for(let i=0;i<lineY.length;i++){

            lineY[i].font = { color : '#EBEBEB'}

            let distancia = Math.abs(lineY[i].y - line[0]._model.y)

            if(distancia<menorDistancia){
              menorDistancia = distancia
              labelMenorDistancia=lineY[i].label
            }
            
          }

          for(let i=0;i<lineY.length;i++){

            if(lineY[i].label==labelMenorDistancia){
              lineY[i].font = { color : '#F8CB1C'}
            }
            
          }


        }

      },
      scales : {
        xAxes : [
          {
            ticks : {
              fontColor : '#EBEBEB',
              callback : (value) => {
                return value
              },
              fontSize : 10,
              fontFamily : 'Work Sans',
              padding : 6
            },
            gridLines : {
              display : false,
            },
          },

        ],
        yAxes : [{
          id : 'Fan page',
          position : 'left',
          ticks : {
            fontColor : '#EBEBEB',
            padding : 15,
            fontSize : 10,
            //Calcula el maximo y minimo para lograr las 7 labels en Y
            suggestedMin : Math.min(...this.dataFanPage),
            suggestedMax : Math.max(...this.dataFanPage),
            stepSize : (Math.max(...this.dataFanPage) - Math.min(...this.dataFanPage)) / 5,
            fontFamily : 'Work Sans',
            callback : (value:string, index, values) => {
              const newValue = parseFloat(value).toFixed(2)
              return newValue + ' K'
            }
          },
          gridLines : {
            borderDash: [1, 2],
            color: "#282828",
            drawBorder: false,
            tickMarkLength : 0,
          }
        },
        {
          id : 'Engaged users',
          position : 'right',
          ticks : {
            fontColor : '#B8B7B7',
            fontSize : 10,
            padding : 15,
            //Calcula el maximo y minimo para lograr las 7 labels en Y
            suggestedMin : Math.min(...this.dataEngaged),
            suggestedMax : Math.max(...this.dataEngaged),
            stepSize : (Math.max(...this.dataEngaged) - Math.min(...this.dataEngaged)) / 5,
            fontFamily : 'Work Sans',
            callback : (value:string, index, values) => {
              const newValue = parseFloat(value).toFixed(2)
              return newValue
            },
          },
          gridLines : {
            drawBorder: false,
            tickMarkLength : 0,
            color: 'transparent'
          }
        }]
      },
      tooltips: {
        enabled: false,
        mode: 'x',
        intersect: false
      }
    }

    // INIT GRAPH
    new Chart('grafica', {
      type: 'line',
      data,
			options
    })

  }

  //Inserta en el array de datasets, 2 lineas por cada dataset, para generar
  //el efecto de los 3 aros

  private createDataSet(name: string, data: number[], color: string): any {

    let dataSetObj

    for(let i=0;i<2;i++){

      dataSetObj = {
        label: name,
        fill: false,
        data: data,
        backgroundColor: color,
        borderColor: color,
        borderWidth : 1,
        yAxisID : name,
        pointHoverRadius : 5,
        pointHoverBackgroundColor : color,
        pointHoverBorderColor : color+"33",
        pointHoverBorderWidth : 8+8*i
      }

      this.datasets.push(dataSetObj)

    }
  }

}



