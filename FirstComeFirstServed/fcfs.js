let listaProcesos =[]

class Proceso{
    constructor(nombre, tiempoLlegada, rafaga, tiempoComienzo, tiempoFinal, tiempoRetorno, tiempoEspera){
      this.nombre = nombre;
      this.tiempoLlegada = tiempoLlegada;
      this.rafaga = rafaga;
      this.tiempoComienzo = tiempoComienzo;
      this.tiempoFinal = tiempoFinal;
      this.tiempoRetorno = tiempoRetorno;
      this.tiempoEspera = tiempoEspera;
    }
  
    calcularTiempoFinal(){
        this.tiempoFinal = this.rafaga + this.tiempoComienzo;
    }

    calcularTiempoRetorno(){
        this.tiempoRetorno = this.rafaga + this.tiempoComienzo;
      }

    calcularTiempoEspera(){
        this.tiempoEspera = this.tiempoRetorno - this.rafaga;
    }

  }

  const cargarProcesosIniciales = () =>{
    let proceso1 = new Proceso("A",0, 8, 0,  8, 8, 0);
    let proceso2 = new Proceso("B",1, 4, 8,  12, 11, 7);
    let proceso3 = new Proceso("C",2, 9, 12, 21, 19, 10);
    let proceso4 = new Proceso("D",3, 5, 21, 26, 23, 18);
    let proceso5 = new Proceso("E",4, 2, 26, 28, 24, 22);
    listaProcesos.push(proceso1,proceso2, proceso3, proceso4, proceso5);
    document.getElementById("table").insertRow(-1).innerHTML = `<td> ${listaProcesos[0].nombre} 
    </td><td>${listaProcesos[0].tiempoLlegada}</td><td>${listaProcesos[0].rafaga}</td>
    <td>${listaProcesos[0].tiempoComienzo}</td> <td>${listaProcesos[0].tiempoFinal} </td> 
    <td>${listaProcesos[0].tiempoRetorno} </td> <td>${listaProcesos[0].tiempoEspera} </td>`;

  }
  
  cargarProcesosIniciales()

var chart = AmCharts.makeChart("chartdiv", {
    "type": "gantt",
    "theme": "light",
    "marginRight": 70,
    "period": "DD",
    "dataDateFormat": "MM-DD",
    "columnWidth": 0.5,
    "valueAxis": {
      "type": "date"
    },
    "brightnessStep": 7,
    "graph": {
      "fillAlphas": 1,
      "lineAlpha": 1,
      "lineColor": "#fff",
      "fillAlphas": 0.85,
      "balloonText": "<b>[[task]]</b>:<br />[[open]] -- [[value]]"
    },
    "rotate": true,
    "categoryField": "category",
    "segmentsField": "segments",
    "colorField": "color",
    "startDateField": "start",
    "endDateField": "end",
    "dataProvider": [{
      "category": listaProcesos[0].nombre,
      "segments": [{
        "start": "01-01",
        "end": "01-04",
        "color": "#b9783f",
        "task":  listaProcesos[0].nombre
      }]
    }],

    "valueScrollbar": {
      "autoGridCount": true
    },
    "chartCursor": {
      "cursorColor": "#55bb76",
      "valueBalloonsEnabled": false,
      "cursorAlpha": 0,
      "valueLineAlpha": 0.5,
      "valueLineBalloonEnabled": true,
      "valueLineEnabled": true,
      "zoomable": false,
      "valueZoomable": true
    },
    "legend": {
      "data": [{
        "title": "Module #1",
        "color": "#b9783f"
      }, {
        "title": "Module #2",
        "color": "#cc4748"
      }, {
        "title": "Module #3",
        "color": "#cd82ad"
      }, {
        "title": "Module #4",
        "color": "#2f4074"
      }, {
        "title": "Module #5",
        "color": "#448e4d"
      }]
    },
    "export": {
      "enabled": true
    }
    });
