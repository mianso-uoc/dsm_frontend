import React, { Component } from "react";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo, faPlus, faMap } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import ReactTooltip from 'react-tooltip';

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
    //cell: row => <button className="btn btn-sm btn-danger" data-tip="Eliminar" onClick={() => {this.deleteMachine(this.state.currentCompany.id)}}><FontAwesomeIcon icon={faTrash} /></button>
  //}
]

export default class Company extends Component {
  constructor(props) {
    super(props);
    this.getCompany = this.getCompany.bind(this);
    this.getMachines = this.getMachines.bind(this);
    this.deleteMachine = this.deleteMachine.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      currentCompany: {
        id: null,
        name: ""
      },
      message: "",
      machines: ""
    };
  }

  componentDidMount() {
    this.getCompany(this.props.match.params.id);
    this.getMachines(this.props.match.params.id);
  }

  getCompany(id) {
    CompanyDataService.get(id)
      .then(response => {
        this.setState({
          currentCompany: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getMachines(id) {
    CompanyDataService.getMachines(id)
      .then(response => {
        this.setState({
          machines: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteMachine(id) {
    CompanyDataService.deleteMachine(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/companies/' + this.state.currentCompany.id + "/view")
        this.refreshList()
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.getMachines(this.props.match.params.id);
  }

  render() {
    const { currentCompany, machines } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Fabricante {currentCompany.name}</h2>
          <hr/>

          <div className="row mb-2">
            <div className="col-md-2"><strong>Dirección</strong></div>
            <div className="col-md-10">{currentCompany.address}</div>
          </div>
          {currentCompany.latitude && currentCompany.longitude && <div className="row mb-2">
            <div className="col-md-2"><strong>Ciudad</strong></div>
            <div className="col-md-8">{currentCompany.city.name}</div>
            <div className="col-md-2">
              <a href={"https://www.google.com/maps/search/?api=1&query=" + currentCompany.latitude + "," + currentCompany.longitude} className="btn btn-success float-right" target="_blank">
                <FontAwesomeIcon icon={faMap} className="mr-2"/>
                Mapa
              </a>
            </div>
          </div>}
          <div className="row mb-2">
            <div className="col-md-2"><strong>Teléfono</strong></div>
            <div className="col-md-10">{currentCompany.phone}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-2"><strong>Latitud</strong></div>
            <div className="col-md-10">{currentCompany.latitude}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-2"><strong>Longitud</strong></div>
            <div className="col-md-10">{currentCompany.longitude}</div>
          </div>
          <div>
            <Link to={"/companies/" + currentCompany.id + "/addMachine"} className="btn btn-info float-right">
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>
              Nueva máquina
            </Link>
          </div>

          <h3>Máquinas</h3>

          {machines.length > 0 &&
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-info">
                <tr>
                  <th className="width20">Id</th>
                  <th className="width60">Producto</th>
                  <th className="width60">Nº serie</th>
                  <th className="width20">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {machines &&
                machines.map((machine, index) => (
                  <tr key={index}>
                    <td>{machine.id}</td>
                    <td>{machine.product && machine.product.name}</td>
                    <td>{machine.serialNumber}</td>
                    <td>
                      <a
                        className="text-danger"
                        data-tip="Eliminar"
                        onClick={() => {this.deleteMachine(machine.id)}}
                      >
                        <ReactTooltip />
                        <FontAwesomeIcon icon={faTrash} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {machines.length == 0 &&
            <div className="alert alert-warning">No hay máquinas</div>
          }

          <Link to={"/companies"} className="btn btn-outline-info btn-sm mr-1">
            <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
          </Link>
          <Link
            to={"/companies/" + currentCompany.id}
            className="btn btn-sm btn-info mr-1"
            data-tip="Editar"
          >
            <FontAwesomeIcon icon={faEdit} /> Editar
          </Link>
        </div>
      </div>
    );
  }
}
