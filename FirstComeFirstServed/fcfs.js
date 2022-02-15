let listaProcesos =[]
let chart;
let ultimoProcesoActivo = 0;
const semaforoRojo = document.getElementById("SemaforoRojo");
const semaforoVerde = document.getElementById("SemaforoVerde");

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
        this.tiempoFinal =String(this.rafaga + parseInt(this.tiempoComienzo));
    }

    calcularTiempoRetorno(){
        this.tiempoRetorno = this.rafaga + parseInt(this.tiempoComienzo);
      }

    calcularTiempoEspera(){
        this.tiempoEspera = this.tiempoRetorno - this.rafaga;
    }
    calcularTiempoComienzo(){
      this.tiempoComienzo =listaProcesos[listaProcesos.length-1].tiempoFinal;
    }

  }

  const cargarProcesosIniciales = () =>{
    let proceso1 = new Proceso("A",0, 8, "0",  "8", 8, 0);
    let proceso2 = new Proceso("B",1, 4, "8",  "12", 11, 7);
    let proceso3 = new Proceso("C",2, 9, "12", "21", 19, 10);
    let proceso4 = new Proceso("D",3, 5, "21", "26", 23, 18);
    let proceso5 = new Proceso("E",4, 2, "26", "28", 24, 22);
    listaProcesos.push(proceso1,proceso2, proceso3, proceso4, proceso5);
    for(let i=0;i<listaProcesos.length;i++){
    document.getElementById("table").insertRow(-1).innerHTML = `<td> ${listaProcesos[i].nombre} 
    </td><td>${listaProcesos[i].tiempoLlegada}</td><td>${listaProcesos[i].rafaga}</td>
    <td>${listaProcesos[i].tiempoComienzo}</td> <td>${listaProcesos[i].tiempoFinal} </td> 
    <td>${listaProcesos[i].tiempoRetorno} </td> <td>${listaProcesos[i].tiempoEspera} </td>`;
    }
  }
  
  cargarProcesosIniciales();

  const crearProceso=()=>{
    nombre=document.getElementById("nameProceso").value;
    tiempoLlegada = parseInt(document.getElementById("tiempoLlegada").value);
    rafaga=parseInt(document.getElementById("rafaga").value);
    
    let procesoNuevo = new Proceso(nombre,tiempoLlegada,rafaga);
    
    procesoNuevo.calcularTiempoComienzo();
    procesoNuevo.calcularTiempoFinal();
    procesoNuevo.calcularTiempoRetorno();
    procesoNuevo.calcularTiempoEspera();

    listaProcesos.push(procesoNuevo);

    document.getElementById("table").insertRow(-1).innerHTML = `<td> ${procesoNuevo.nombre} 
    </td><td>${procesoNuevo.tiempoLlegada}</td><td>${procesoNuevo.rafaga}</td>
    <td>${procesoNuevo.tiempoComienzo}</td> <td>${procesoNuevo.tiempoFinal} </td> 
    <td>${procesoNuevo.tiempoRetorno} </td> <td>${procesoNuevo.tiempoEspera} </td>`;

    actualizarGraficaProcesos();
  }

  function actualizarGraficaProcesos() {
      if (ultimoProcesoActivo < listaProcesos.length) {
        semaforoVerde.style.display = "none";
        semaforoRojo.style.display = "block";
        setTimeout(() => {
              ultimoProcesoActivo++;
              let procesosGraficados = listaProcesos.slice(0, ultimoProcesoActivo);
              chart.data = procesosGraficados;
              actualizarGraficaProcesos();
          }, 3000);
      }else{
          semaforoVerde.style.display = "block";
          semaforoRojo.style.display = "none";
      }
  }

  am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
    chart.paddingRight = 30;
    chart.dateFormatter.inputDateFormat = "ss";
    
    var colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;
    
    chart.dateFormatter.dateFormat = "ss";
    chart.dateFormatter.inputDateFormat = "ss";
    
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "nombre";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = { count: 1, timeUnit: "second" };
    // dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
    //dateAxis.strictMinMax = true;
    dateAxis.renderer.tooltipLocation = 0;
    
    var series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(70);
    series1.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";
    
    series1.dataFields.openDateX = "tiempoComienzo";
    series1.dataFields.dateX = "tiempoFinal";
    series1.dataFields.categoryY = "nombre";
    series1.columns.template.propertyFields.fill = "color"; // get color from data
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 0;
    
    chart.scrollbarX = new am4core.Scrollbar();
    
    }); 
