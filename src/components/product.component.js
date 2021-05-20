import React, { Component } from "react";
import ProductDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.getManufacturer = this.getManufacturer.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);

    this.state = {
      currentProduct: {
        id: null,
        name: ""
      },
      currentManufacturer: null,
      message: ""
    };
  }

  componentDidMount() {
    this.getProduct(this.props.match.params.id);
    this.getManufacturer(this.props.match.params.id);
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

  getManufacturer(id) {
    ProductDataService.getByProduct(id)
      .then(response => {
        this.setState({
          currentManufacturer: response.data
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
        toast.success('Se ha guardado el producto ', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        //this.props.history.push('/manufacturers/' + this.state.currentManufacturer.id + '/view');
      })
      .catch(e => {
        toast.error('Se ha producido un error al guardar el producto', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
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
        toast.error('Se ha producido un error al eliminar el producto', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        console.log(e);
      });
  }

  render() {
    const { currentProduct, currentManufacturer } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentProduct ? (
            <div className="edit-form">
              <h4>Fabricante {currentManufacturer && currentManufacturer.name}</h4>
              <ToastContainer />
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
