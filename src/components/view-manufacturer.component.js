import React, { Component } from "react";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo, faPlus } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columnas = [
  {
    name: "Id",
    selector: "id",
    sortable: true
  },
  {
    name: "Nombre",
    selector: "name",
    sortable: true
  },
  //{
    //name: '',
    //sortable: false,
    //cell: row => <button className="btn btn-sm btn-danger" data-tip="Eliminar" onClick={() => {this.deleteProduct(this.state.currentManufacturer.id)}}><FontAwesomeIcon icon={faTrash} /></button>
  //}
]

const paginacionOpciones = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllrowsItemText: "todos"
}

export default class Manufacturer extends Component {
  constructor(props) {
    super(props);
    this.getManufacturer = this.getManufacturer.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      currentManufacturer: {
        id: null,
        name: ""
      },
      message: "",
      products: ""
    };
  }

  componentDidMount() {
    this.getManufacturer(this.props.match.params.id);
    this.getProducts(this.props.match.params.id);
  }

  getManufacturer(id) {
    ManufacturerDataService.get(id)
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

  getProducts(id) {
    ManufacturerDataService.getProducts(id)
      .then(response => {
        this.setState({
          products: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteProduct(id) {
    ManufacturerDataService.deleteProduct(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/manufacturers/' + this.state.currentManufacturer.id + "/view")
        this.refreshList();
        toast.success('Se ha eliminado el producto ' + id, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
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

  refreshList() {
    this.getProducts(this.props.match.params.id);
  }

  render() {
    const { currentManufacturer, products } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Fabricante {currentManufacturer.name}</h2>
          <ToastContainer />
          <div>
            <Link to={"/manufacturers/" + currentManufacturer.id + "/addProduct"} className="btn btn-info float-right">
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>
              Nuevo producto
            </Link>
          </div>

          <h3>Productos</h3>

          <table className="table table-striped table-bordered table-hover">
            <thead className="table-info">
              <tr>
                <th className="width20">Id</th>
                <th className="width60">Nombre</th>
                <th className="width20">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products &&
              products.map((product, index) => (
                <tr key={index}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    <Link
                      to={"/products/" + product.id}
                      className="text-primary mr-1"
                      data-tip="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Link
                      className="text-danger"
                      data-tip="Eliminar"
                      onClick={() => {this.deleteProduct(product.id)}}
                    >
                      <ReactTooltip />
                      <FontAwesomeIcon icon={faTrash} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link to={"/manufacturers"} className="btn btn-outline-info btn-sm mr-1">
            <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
          </Link>
        </div>
      </div>
    );
  }
}
