
var test = "blah"
console.log(test)
console.log("error modal loading")

var Modal = ReactBootstrap.Modal;

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