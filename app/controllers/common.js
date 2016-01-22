//STOCK FILTER
function filterStocks(stocks, stockName) {
  
  return stocks.filter(function(stock) {
    return stock.name !== stockName;
  })

}

function getDate(date) {
  return new Date(date)
}

function addLabels(height, margin, width, svg, data) {
  //ADD Y LABEL
   var yLabel = svg.append("text")
     .attr("x", 0 - height/2)
     .attr("y", 0 - margin.left/1.5)
      .style("text-anchor", "middle")
      .text("Stock Price ($)")
      .attr('transform', 'rotate(-90)')
      .classed("label", true)
   //ADD X LABEL
    svg.append("text")
     .attr("x", width / 2)
     .attr("y", height + margin.bottom/1.3)
      .style("text-anchor", "middle")
      .text("Date")
      .classed("label", true)
 
}

function randomColor() {
  
  function random() {
    return Math.floor((Math.random() * 255));
  }
  
  var color = "rgb("+ random() + "," + random() + "," + random()+ ")"
 return color;
}