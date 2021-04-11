import React, { Component } from "react";
import ProductDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);

    this.state = {
      currentProduct: {
        id: null,
        name: ""
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getProduct(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentProduct: {
          ...prevState.currentProduct,
          name: name
        }
      };
    });
  }

  getProduct(id) {
    ProductDataService.getProduct(id)
      .then(response => {
        this.setState({
          currentProduct: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateProduct() {
    ProductDataService.updateProduct(
      this.state.currentProduct.id,
      this.state.currentProduct
    )
      .then(response => {
        console.log(response.data);
        this.props.history.push('/manufacturers')
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteProduct() {    
    ProductDataService.deleteProduct(this.state.currentProduct.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/manufacturers')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentProduct } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentProduct ? (
            <div className="edit-form">
              <h4>Fabricante</h4>
              <form>
                <div className="form-group row">
                  <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control col-sm-6"
                    id="name"
                    value={currentProduct.name}
                    onChange={this.onChangeName}
                  />
                </div>
              </form>          

              <div>

                <Link to={"/manufacturers"} className="btn btn-outline-info btn-sm mr-1">
                  <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
                </Link>

                <button
                  type="submit"
                  className="btn btn-info btn-sm mr-1"
                  onClick={this.updateProduct}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2"/>Guardar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.deleteProduct}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2"/>Eliminar
                </button>
              </div>

              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Product...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}