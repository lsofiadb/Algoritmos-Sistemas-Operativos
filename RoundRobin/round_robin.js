let listaProcesos = [];
let listaGrupoProcesos = [];
let chart;
let ultimoProcesoActivo = 0;
let bloquearProcesoActivo = false;
let auxiliarTiempo = 0;
let contador = 0;
let cuantum = 4;
const semaforoRojo = document.getElementById("SemaforoRojo");
const semaforoVerde = document.getElementById("SemaforoVerde");

class Proceso {
  constructor(
    nombre,
    tiempoLlegada,
    rafaga,
    tiempoComienzo,
    tiempoFinal,
    tiempoRetorno,
    tiempoEspera,
    rafagaEjecutada,
    estado
  ) {
    this.nombre = nombre;
    this.tiempoLlegada = tiempoLlegada;
    this.rafaga = rafaga;
    this.tiempoComienzo = tiempoComienzo;
    this.tiempoFinal = tiempoFinal;
    this.tiempoRetorno = tiempoRetorno;
    this.tiempoEspera = tiempoEspera;
    this.rafagaEjecutada = 0;
    this.estado = estado;
  }

  calcularTiempoFinal() {
    this.tiempoFinal = String(this.rafaga + parseInt(this.tiempoComienzo));
  }

  calcularTiempoRetorno() {
    this.tiempoRetorno = this.tiempoFinal - parseInt(this.tiempoLlegada);
  }

  calcularTiempoEspera() {
    this.tiempoEspera = this.tiempoRetorno - this.rafaga;
  }
  calcularTiempoComienzo() {
    this.tiempoComienzo = listaProcesos[listaProcesos.length - 1].tiempoFinal;
  }
  actualizarTiempoComienzo(i) {
    this.tiempoComienzo = listaProcesos[i - 1].tiempoFinal;
  }
  calcularTiempoEsperaRoundRobin() {
    this.tiempoEspera =
      this.tiempoRetorno - (this.rafagaEjecutada + this.rafaga);
  }
  sumarRafagaEjecutada(cantidadParticiones) {
    this.rafagaEjecutada = 4 * cantidadParticiones;
  }
}

const cargarProcesosIniciales = () => {
  let proceso1 = new Proceso("A", 0, 8, "11", "19", 19, 11);
  let proceso2 = new Proceso("B", 0, 4, "2", "6", 6, 2);
  let proceso3 = new Proceso("C", 0, 9, "19", "28", 28, 19);
  let proceso4 = new Proceso("D", 0, 5, "6", "11", 11, 6);
  let proceso5 = new Proceso("E", 0, 2, "0", "2", 2, 0);
  listaProcesos.push(proceso1, proceso2, proceso3, proceso4, proceso5);
  listaProcesos.sort(function (a, b) {
    return a.rafaga - b.rafaga;
  });
  /*
  for (let i = 0; i < listaProcesos.length; i++) {
    document
      .getElementById("table")
      .insertRow(-1).innerHTML = `<td> ${listaProcesos[i].nombre} 
    </td><td>${listaProcesos[i].tiempoLlegada}</td><td>${listaProcesos[i].rafaga}</td>`;
  }*/
};

//cargarProcesosIniciales();

const crearGrupoProcesosOrdenados = () => {
  nombre = document.getElementById("nameProceso").value;
  tiempoLlegada = parseInt(document.getElementById("tiempoLlegada").value);
  rafaga = parseInt(document.getElementById("rafaga").value);
  console.log(nombre);
  console.log(tiempoLlegada);
  console.log(rafaga);
  if (tiempoLlegada < auxiliarTiempo) {
    alert(
      "El proceso NO puede tener un tiempo de llegada menor al del ultimo proceso"
    );
  } else {
    auxiliarTiempo = tiempoLlegada;
    let procesoNuevo = new Proceso(nombre, tiempoLlegada, rafaga);
    listaGrupoProcesos.push(procesoNuevo);
    console.log(listaGrupoProcesos);
    alert("Proceso a??adido");
  }
};

const ejecutarProcesos = () => {
  console.log("concat");
  listaProcesos = listaProcesos.concat(listaGrupoProcesos);
  console.log("lista con concat");
  console.log(listaProcesos);
  for (
    let i = listaProcesos.length - listaGrupoProcesos.length;
    i < listaProcesos.length;
    i++
  ) {
    if (i === 0) {
      listaProcesos[i].tiempoComienzo = "0";
    } else {
      listaProcesos[i].actualizarTiempoComienzo(i);
    }
    listaGrupoProcesos = [];
    if (listaProcesos[i].rafaga > cuantum) {
      let nuevaRafaga = listaProcesos[i].rafaga - cuantum;
      console.log(nuevaRafaga);
      let procesoNuevo = new Proceso(
        listaProcesos[i].nombre,
        listaProcesos[i].tiempoLlegada,
        nuevaRafaga,
        0,
        0,
        0,
        0,
        0,
        true
      );
      let listaProcesosParticion = listaProcesos.filter(
        (proceso) => proceso.nombre === procesoNuevo.nombre
      );
      procesoNuevo.sumarRafagaEjecutada(listaProcesosParticion.length);
      
      console.log(procesoNuevo.tiempoEspera);
      console.log(procesoNuevo.rafagaEjecutada);
      console.log(procesoNuevo.tiempoRetorno);
      listaProcesos.push(procesoNuevo);
      listaProcesos[i].rafaga = cuantum;
    }
    if (listaProcesos[i].estado) {
      listaProcesos[i].calcularTiempoFinal();
      listaProcesos[i].calcularTiempoRetorno();
      listaProcesos[i].calcularTiempoEsperaRoundRobin();
    } else {
      listaProcesos[i].calcularTiempoFinal();
      listaProcesos[i].calcularTiempoRetorno();
      listaProcesos[i].calcularTiempoEspera();
    }
  }

  for (let i = ultimoProcesoActivo; i < listaProcesos.length; i++) {
    crearProceso(listaProcesos[i]);
  }
  actualizarGraficaProcesos();
};

function crearProceso(procesoNuevo) {
  document
    .getElementById("table")
    .insertRow(
      -1
    ).innerHTML = `<td> ${procesoNuevo["nombre"]} </td><td>${procesoNuevo.tiempoLlegada}</td><td>${procesoNuevo.rafaga}</td>`;
}

function actualizarGraficaProcesos() {
  if (ultimoProcesoActivo < listaProcesos.length) {
    semaforoVerde.style.display = "none"; //verde encendido
    semaforoRojo.style.display = "block"; //rojo apagado
    setTimeout(() => {
      semaforoVerde.style.display = "block";
      semaforoRojo.style.display = "none";
      if (bloquearProcesoActivo) {
        bloquearProcesoActivo = false;
        listaProcesos[ultimoProcesoActivo].rafaga /= 2;
        listaProcesos[ultimoProcesoActivo].calcularTiempoFinal();
        listaProcesos[ultimoProcesoActivo].calcularTiempoRetorno();
        if (listaProcesos[ultimoProcesoActivo].estado) {
          listaProcesos[ultimoProcesoActivo].calcularTiempoEsperaRoundRobin();
        } else {
          listaProcesos[ultimoProcesoActivo].calcularTiempoEspera();
        }

        //Si ultimo proceso activo no es el ultimo proceso de la lista
        if (parseInt(ultimoProcesoActivo) + 1 != listaProcesos.length) {
          console.log("hoka" + ultimoProcesoActivo + 1);
          listaProcesos[ultimoProcesoActivo + 1].actualizarTiempoComienzo(
            ultimoProcesoActivo + 1
          );
          listaProcesos[ultimoProcesoActivo + 1].calcularTiempoFinal();
          listaProcesos[ultimoProcesoActivo + 1].calcularTiempoRetorno();
          if (listaProcesos[ultimoProcesoActivo + 1].estado) {
            listaProcesos[
              ultimoProcesoActivo + 1
            ].calcularTiempoEsperaRoundRobin();
          } else {
            listaProcesos[ultimoProcesoActivo + 1].calcularTiempoEspera();
          }
        }

        nombre = listaProcesos[ultimoProcesoActivo].nombre;
        rafaga = listaProcesos[ultimoProcesoActivo].rafaga;
        tiempoLlegada = listaProcesos[ultimoProcesoActivo].tiempoLlegada;

        segundaParteProceso = new Proceso(nombre, tiempoLlegada, rafaga);

        for (let i = ultimoProcesoActivo + 2; i < listaProcesos.length; i++) {
          listaProcesos[i].actualizarTiempoComienzo(i);
          listaProcesos[i].calcularTiempoFinal();
          listaProcesos[i].calcularTiempoRetorno();
          if (listaProcesos[i].estado) {
            listaProcesos[i].calcularTiempoEsperaRoundRobin();
          } else {
            listaProcesos[i].calcularTiempoEspera();
          }
        }

        if (parseInt(ultimoProcesoActivo) + 1 != listaProcesos.length) {
          segundaParteProceso.calcularTiempoComienzo();
        } else {
          segundaParteProceso.calcularTiempoComienzo();
        }
        segundaParteProceso.estado = listaProcesos[ultimoProcesoActivo].estado;
        segundaParteProceso.rafagaEjecutada =
          listaProcesos[ultimoProcesoActivo].rafagaEjecutada;
        segundaParteProceso.calcularTiempoFinal();
        segundaParteProceso.calcularTiempoRetorno();
        if (segundaParteProceso.estado) {
          segundaParteProceso.calcularTiempoEsperaRoundRobin();
        } else {
          segundaParteProceso.calcularTiempoEspera();
        }
        segundaParteProceso.tiempoEspera += 2;

        listaProcesos.push(segundaParteProceso);
        document
          .getElementById("table")
          .insertRow(
            -1
          ).innerHTML = `<td> ${segundaParteProceso["nombre"]} </td><td>${segundaParteProceso.tiempoLlegada}</td><td>${segundaParteProceso.rafaga}</td>`;
        let auxiliarLista = listaProcesos.slice(
          ultimoProcesoActivo + 2,
          listaProcesos.length
        );
        console.log("lleno");
        console.log(listaProcesos);
        document.getElementById("table").rows[
          ultimoProcesoActivo + 1
        ].innerHTML = `<td> ${listaProcesos[ultimoProcesoActivo].nombre} 
              </td><td>${listaProcesos[ultimoProcesoActivo].tiempoLlegada}</td><td>${listaProcesos[ultimoProcesoActivo].rafaga}</td><td>${listaProcesos[ultimoProcesoActivo].tiempoComienzo}</td> <td>${listaProcesos[ultimoProcesoActivo].tiempoFinal} </td> 
              <td>${listaProcesos[ultimoProcesoActivo].tiempoRetorno} </td> <td>${listaProcesos[ultimoProcesoActivo].tiempoEspera} </td>`;
        ultimoProcesoActivo++;
        let procesosGraficados = listaProcesos.slice(0, ultimoProcesoActivo);
        chart.data = procesosGraficados;
      } else {
        document.getElementById("table").rows[
          ultimoProcesoActivo + 1
        ].innerHTML = `<td> ${listaProcesos[ultimoProcesoActivo].nombre} 
              </td><td>${listaProcesos[ultimoProcesoActivo].tiempoLlegada}</td><td>${listaProcesos[ultimoProcesoActivo].rafaga}</td><td>${listaProcesos[ultimoProcesoActivo].tiempoComienzo}</td> <td>${listaProcesos[ultimoProcesoActivo].tiempoFinal} </td> 
              <td>${listaProcesos[ultimoProcesoActivo].tiempoRetorno} </td> <td>${listaProcesos[ultimoProcesoActivo].tiempoEspera} </td>`;
        ultimoProcesoActivo++;
        let procesosGraficados = listaProcesos.slice(0, ultimoProcesoActivo);
        chart.data = procesosGraficados;
        setTimeout(() => {
          actualizarGraficaProcesos();
        }, 3000);
      }
    }, 3000);
  } else {
    semaforoVerde.style.display = "block";
    semaforoRojo.style.display = "none";
  }
}

const bloquearProceso = () => {
  bloquearProcesoActivo = true;
};
am4core.ready(function () {
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
  series1.columns.template.tooltipText =
    "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

  series1.dataFields.openDateX = "tiempoComienzo";
  series1.dataFields.dateX = "tiempoFinal";
  series1.dataFields.categoryY = "nombre";
  series1.columns.template.propertyFields.fill = "color"; // get color from data
  series1.columns.template.propertyFields.stroke = "color";
  series1.columns.template.strokeOpacity = 0;

  chart.scrollbarX = new am4core.Scrollbar();
});
