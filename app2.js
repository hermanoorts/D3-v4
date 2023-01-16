
// Margenes y tamaños del grafico
var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// agregamos el svg al proyecto
var svg = d3.select("#graf")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          

//leemos los datos
d3.csv("data/data_simply.csv", function(data) {

    // Lista de los grupos
    var allGroup = ["Total", "0 a 5 años", "6 a 9 años", "10 a 12 años","13 años y más"]

    // Procesado de datos: array de arrays(x,y)
    var dataReady = allGroup.map( function(grpName) { 
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: d.time, value: +d[grpName]};
        })
      };
    });
   
    // Escala de colores
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Agregamos el eje X
    var x = d3.scaleLinear()
      .domain([1990,2030])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Agregamos el eje Y
    var y = d3.scaleLinear()
      .domain( [3,14])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Lineas
    var line = d3.line()
      .x(function(d) { return x(+d.time) })
      .y(function(d) { return y(+d.value) })
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    // Puntos
    svg
    
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.name) })
        .attr("class", function(d){ return d.name })
      // valores
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.time) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 5)
        .attr("stroke", "white")

    // Nombre a cada linea
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr("class", function(d){ return d.name })
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) 
          .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) 
          .attr("x", 20)
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15)

   
})

