import React, { Component } from "react";
import CompanyDataService from "../services/company.service";
import LocationDataService from "../services/location.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo, faPlus, faMap } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Company extends Component {
  constructor(props) {
    super(props);
    this.getCompany = this.getCompany.bind(this);
    this.getMachines = this.getMachines.bind(this);
    this.deleteMachine = this.deleteMachine.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.getProvince = this.getProvince.bind(this);

    this.state = {
      currentCompany: {
        id: null,
        name: "",
        province: null
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

  getProvince(id) {
    LocationDataService.getProvinceByCity(id)
      .then(response => {
        this.setState({
          province: response.data
        });
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
        toast.success('Se ha eliminado la m??quina ', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        this.refreshList()
      })
      .catch(e => {
        toast.error('Se ha producido un error al eliminar la m??quina', {
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
    this.getMachines(this.props.match.params.id);
  }

  render() {
    const { currentCompany, machines, province } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Empresa {currentCompany.name}</h2>
          <ToastContainer />
          <hr/>

          <div className="row mb-2">
            <div className="col-md-2"><strong>Direcci??n</strong></div>
            <div className="col-md-10">{currentCompany.address}</div>
          </div>
          {province && <div className="row mb-2">
            <div className="col-md-2"><strong>Provincia</strong></div>
            <div className="col-md-8">{province.name}</div>
          </div>}
          {currentCompany.city && <div className="row mb-2">
            <div className="col-md-2"><strong>Ciudad</strong></div>
            <div className="col-md-8">{currentCompany.city.name}</div>
            {currentCompany.latitude && currentCompany.longitude &&
              <div className="col-md-2">
                <a href={"https://www.google.com/maps/search/?api=1&query=" + currentCompany.latitude + "," + currentCompany.longitude} className="btn btn-success float-right" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faMap} className="mr-2"/>
                  Mapa
                </a>
              </div>
            }
          </div>}
          <div className="row mb-2">
            <div className="col-md-2"><strong>Tel??fono</strong></div>
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
              Nueva m??quina
            </Link>
          </div>

          <h3>M??quinas</h3>

          {machines.length > 0 &&
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-info">
                <tr>
                  <th className="width20">Id</th>
                  <th className="width60">Producto</th>
                  <th className="width60">N?? serie</th>
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
                      <Link
                        to={"/machines/" + machine.id}
                        className="text-primary mr-1"
                        data-tip="Editar"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
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
            <div className="alert alert-warning">No hay m??quinas</div>
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
