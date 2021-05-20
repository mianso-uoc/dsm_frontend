import React, { Component } from "react";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ManufacturersList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.retrieveManufacturers = this.retrieveManufacturers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveManufacturer = this.setActiveManufacturer.bind(this);
    this.searchName = this.searchName.bind(this);
    this.deleteManufacturer = this.deleteManufacturer.bind(this);

    this.state = {
      manufacturers: [],
      currentManufacturer: null,
      currentIndex: -1,
      searchName: ""
    };
  }

  componentDidMount() {
    this.retrieveManufacturers();
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }

  retrieveManufacturers() {
    ManufacturerDataService.getAll()
      .then(response => {
        this.setState({
          manufacturers: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveManufacturers();
    this.setState({
      currentManufacturer: null,
      currentIndex: -1
    });
  }

  setActiveManufacturer(manufacturer, index) {
    this.setState({
      currentManufacturer: manufacturer,
      currentIndex: index
    });
  }

  searchName() {
    ManufacturerDataService.findByName(this.state.searchName)
      .then(response => {
        this.setState({
          manufacturers: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteManufacturer(id) {
    ManufacturerDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/manufacturers');
        this.refreshList();
        toast.success('Se ha eliminado el fabricante', {
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
        toast.error('Se ha producido un error al eliminar el fabricante', {
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
    const { searchName, manufacturers, currentManufacturer, currentIndex } = this.state;

    return (
      <div className="row">
        {/*<div className="col-md-12">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre"
              value={searchName}
              onChange={this.onChangeSearchName}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchName}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>*/}
        <div className="col-md-12">
          <div className="row">
            <h2 className="col-md-10">Fabricantes</h2>
            <ToastContainer />
            <div className="col-md-2">
              <Link to={"/manufacturers/add"} className="btn btn-info float-right">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Nuevo
              </Link>
            </div>
          </div>
          {manufacturers.length > 0 &&
           <table className="table table-striped table-bordered table-hover">
            <thead className="table-info">
              <tr>
                <th className="width20">Id</th>
                <th className="width60">Nombre</th>
                <th className="width20">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {manufacturers &&
              manufacturers.map((manufacturer, index) => (
                <tr onClick={() => this.setActiveManufacturer(manufacturer, index)} key={index}>
                  <td>{manufacturer.id}</td>
                  <td>{manufacturer.name}</td>
                  <td>
                    <Link
                      to={"/manufacturers/" + manufacturer.id + "/view"}
                      className="text-dark mr-1"
                      data-tip="Ver"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link
                      to={"/manufacturers/" + manufacturer.id}
                      className="text-primary mr-1"
                      data-tip="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Link
                      className="text-danger"
                      data-tip="Eliminar"
                      onClick={() => {this.deleteManufacturer(manufacturer.id)}}
                    >
                      <ReactTooltip />
                      <FontAwesomeIcon icon={faTrash} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          }
          {manufacturers.length == 0 &&
            <div className="alert alert-warning">No hay fabricantes</div>
          }
        </div>
      </div>
    );
  }
}
