'use strict';

//GET REACT BOOTSTRAP COMPONENTS

var ButtonGroup = ReactBootstrap.ButtonGroup;
var Button  = ReactBootstrap.Button;    
var Modal = ReactBootstrap.Modal;
var Input = ReactBootstrap.Input;

//SOCKET.IO SETUP
var port = 3000;
console.log(window.location.hostname)
var socket = io.connect(window.location.hostname + ":" + port);

//FUNCTIONS


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



//CONTAINER TO HOLD COMPONENTS
var StockContainer = React.createClass({

    getInitialState() {
     
      return { 
      stocks: [],
    };

    },

    updateStocks(stock) {
      var component = this;
      socket.on('serverStocks', function (data) {
          component.setState({stocks: data.stocks});
       });
    },
  
    removeStock(stock) {
    socket.emit('removeStock', {stock: stock});
    var stocks = this.state.stocks;
    filterStocks(stocks, stock)
    this.setState({stocks: filterStocks(stocks, stock)})
    },

    render: function() {

       return (
          <div>
         <InputBox first={this.state.first} updateStocks={this.updateStocks} stocks={this.state.stocks} removeStock={this.removeStock}/>
          <SVG stocks={this.state.stocks}/>
          </div>
        );
  
  
      }
});



//PANEL FOR EACH RECIPE
var InputBox = React.createClass({
  
      getInitialState() {
    return { 
      showModal: false,
      modalText: "",
      stock: "MSFT"
    };
    },
  
  
    componentDidMount: function() {
      this.addStock();
    },
  
    close: function() {
      this.setState({showModal: false})
    },
  
    show: function() {
    this.setState({ showModal: true })
    },

    keyPress: function(e) {
     if (e.charCode === 13) {
     	this.addStock()
     }
    },
    
  
  
   addStock: function() {
    console.log("called")
     var stocks = this.props.stocks
     var stock = this.state.stock.toUpperCase()
     //CHECK IF STOCK ALREADY ADDED

     var stockNotAdded = true;
     stocks.map(function(stockObj) {
       if (stock === stockObj.name) {
         
         this.setState({modalText: "You already added that stock"})
         this.setState({showModal: true})
         stockNotAdded = false;
       }
     }.bind(this))
   
     //if stock not already added - make ajax request
     if (stockNotAdded) {
     
       var date = new Date();
       var month = date.getMonth() + 1;
       
       
        var url = "https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?api_key=scg9nFzbjxfysc6spmY3&start_date=2016-" + month + "-01&end_date=2016-" + month + "-30"
    
        $.getJSON(url, function(data) {    
          
        })
        //IF SUCCESS
        .success(function(data) {
          var december = data.dataset.data;
          var closingObj = {};
          closingObj.name = stock;
          closingObj.data = [];
          closingObj.color = randomColor();
            december.map(function(data) {
              closingObj.data.push([data[0], data[4]])
            });
        this.props.updateStocks(closingObj)
         socket.emit('clientStocks', {stock: closingObj});
          }.bind(this))
          
          //IF ERR
        .error(function() {
          this.setState({modalText: "No Data Found for That Stock, Please Try Again"})
          this.setState({showModal:true})
        }.bind(this))
        }
        this.setState({stock: ""})
  },

  updateState: function(event) {
    this.setState({stock: event.target.value})
  },
  
  removeStock: function(stockName) {
    this.props.removeStock(stockName);
  },
   
  render: function() {
    
    return (
      <div className="input-holder">
      <Input type="text" placeholder="Enter stock name" className="input" onChange={this.updateState} value={this.state.stock} onKeyPress={this.keyPress}/> 
      <Button className="add-btn" onClick={this.addStock}> Add </Button>
      
        <div className="stock-buttons">

      {this.props.stocks.map(function(stock) {
              var stockName = stock.name;
              var buttonStyle = {background: stock.color};
              return <Button key={stock.name} className="stock-button" style={buttonStyle} onClick={this.removeStock.bind(null, stockName)}> {stock.name}  <span id = "x"> x </span>  </Button>;
            }.bind(this))}

      </div>
      
      <ErrorModal show={this.state.showModal} onHide={this.close} text={this.state.modalText}/>
      </div>
    )
  }

});


//MODAL TO EDIT RECIPE
var ErrorModal = React.createClass({
  
  getInitialState: function() {
    return {name: this.props.name,
           ingredients: this.props.ingredients,
           }
  },
  
  render: function() {
    return (
      <div className="static-modal">
        <Modal show={this.props.show}>

      <Modal.Body>
            {this.props.text}
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" className="close-button" onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
        </Modal>
      </div>
    )
    
      }
});


var SVG = React.createClass({
  
  getInitialState: function() {
      return  { 
      margin: {top: 20, right: 70, bottom: 70, left: 70},
    }
  },
  
  componentDidMount: function() {
       //CREATE SVG MARGIN
    
   var margin = this.state.margin;
    
   var width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    this.setState({height: height, width: width})

    //DEFINE SVG
    var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    this.setState({svg: svg})
    
    
    
  },
  
  componentDidUpdate: function() {
 
    //GET VARIABLES FROM STATE
  var stocks = this.props.stocks; 
  var height = this.state.height;
  var width = this.state.width;
  var svg = this.state.svg;
  var margin =this.state.margin;
    

    //REMOVE OLD LINES AND AXES
   d3.selectAll("path.line").remove()
   d3.selectAll(".axis").remove()
   d3.selectAll(".scatterPlotGroup").remove()
    
    //ADD BEGINNING AXES
    
   
     var stockData = []
  stocks.map(function(stock) {
     for (var i = 0; i < stock.data.length; i++) {
    stockData.push(stock.data[i][1])
  }
    
  });
 
  stockData.sort(function(a,b) { return a - b;})
  
  var max = stockData[stockData.length - 1]
  var min = stockData[0]
  var maxDate = getDate(stocks[0].data[0][0])
  var minDate = getDate(stocks[0].data[stocks[0].data.length-1][0])

   //DEFINE SCALE 
var y = d3.scale.linear().domain([max, min]).range([0, height]);
  
var x = d3.time.scale().domain([minDate, maxDate]).range([0, width]);
    
   //DEFINE AXES
  
 var xAxis = d3.svg.axis().scale(x).orient("bottom")
 var yAxis = d3.svg.axis().scale(y).orient("left")
   
  //DECLARE AND BUILD LINES
 var lineFunction = d3.svg.line()
                          .x(function(d, i) { return x(getDate(d[0]));})
                          .y(function(d) { return y(d[1]);})
                          .interpolate("linear")

 stocks.map(function(stock) {
    var lineGraph = svg.append("path")
                            .attr("d", lineFunction(stock.data))
                            .attr("stroke", stock.color)
                            .attr("stroke-width", 2)
                            .attr("fill", "none")
                            .classed("line", true);
           
      var totalLength = lineGraph.node().getTotalLength();   
      
    
      lineGraph.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", 0-totalLength)
        .transition()
        .delay(1000)
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
        });
    
     //CREATE TOOLTIP
    var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0)
  
   //CREATE CIRCLES
    var scatterPlotGroups = svg.selectAll(".scatterPlotGroup")
        .data(stocks)
        .enter().append("g")
        .attr("class", "scatterPlotGroup");

    var circles = scatterPlotGroups.selectAll("circle")
        .data(function(d) { return d.data; })
        .enter().append("circle")
        .attr("cx", function(d) { return x(getDate(d[0])); })
        .attr("cy", function(d) { return y(d[1]) + 1000 })
        .attr("r", 3)
        .attr("fill", "black")

    circles.
        transition()
        .duration(1000)
        .attr("cy", function(d) { return y(d[1])});

//TOOL TIP ANIMATION
    circles.on("mouseover", function (d) {

      tooltip.transition()
            .duration(200)
            .style("opacity", 0.8)
            
      tooltip.html("Date: " + d[0] + "<br>Stock: " + d[1])
            .style("left", (d3.event.pageX + 10) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");    
       }) 
   
   circles.on("mouseout", function(d) {
     tooltip.transition()
        .duration(200)
        .style("opacity", 0)
   })
  
    //BUILD AXES
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (0) + "," + height + ")")
        .call(xAxis)
        .classed("axis", true)
  
    svg.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .classed("axis", true)
        
        svg.append("path")
                  .attr("d", "M 0 0 L 0 " + height +  " L " + width + " " + height).classed("axes", true)
  
    addLabels(height, margin, width, svg, stocks);
    
  },
  
  
  render: function(){
  
    return (
      <div className="svg-container">
      </div>
    )
  }
  
})

//RENDER CONTAINER

ReactDOM.render(<StockContainer />, document.getElementById("stock-container"));
