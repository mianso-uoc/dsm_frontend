import React, { Component } from "react";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class CompaniesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.retrieveCompanies = this.retrieveCompanies.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveCompany = this.setActiveCompany.bind(this);
    this.searchName = this.searchName.bind(this);
    this.deleteCompany = this.deleteCompany.bind(this);

    this.state = {
      companies: [],
      currentCompany: null,
      currentIndex: -1,
      searchName: ""
    };
  }

  componentDidMount() {
    this.retrieveCompanies();
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }

  retrieveCompanies() {
    CompanyDataService.getAll()
      .then(response => {
        this.setState({
          companies: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveCompanies();
    this.setState({
      currentCompany: null,
      currentIndex: -1
    });
  }

  setActiveCompany(company, index) {
    this.setState({
      currentCompany: company,
      currentIndex: index
    });
  }

  searchName() {
    CompanyDataService.findByName(this.state.searchName)
      .then(response => {
        this.setState({
          companies: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteCompany(id) {
    CompanyDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/companies');
        this.refreshList()
        toast.success('Se ha eliminado la empresa ' + id, {
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
        toast.error('Se ha producido un error al eliminar la empresa', {
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
    const { companies } = this.state;

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
            <h2 className="col-md-10">Empresas</h2>
            <ToastContainer />
            <div className="col-md-2">
              <Link to={"/companies/add"} className="btn btn-info float-right">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Nuevo
              </Link>
            </div>
          </div>
          {companies.length > 0 &&
           <table className="table table-striped table-bordered table-hover">
            <thead className="table-info">
              <tr>
                <th className="width20">Id</th>
                <th className="width60">Nombre</th>
                <th className="width20">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {companies &&
              companies.map((company, index) => (
                <tr onClick={() => this.setActiveCompany(company, index)} key={index}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>
                    <Link
                      to={"/companies/" + company.id + "/view"}
                      className="mr-1 text-dark"
                      data-tip="Ver"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link
                      to={"/companies/" + company.id}
                      className="mr-1 text-primary"
                      data-tip="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <Link
                      className="text-danger"
                      data-tip="Eliminar"
                      onClick={() => {this.deleteCompany(company.id)}}
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
          {companies.length == 0 &&
            <div className="alert alert-warning">No hay fabricantes</div>
          }
        </div>
      </div>
    );
  }
}
