import React, { Component } from "react";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import IssueDataService from "../services/issue.service";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faEye, faUser, faIndustry, faBoxes } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';
import Select from 'react-select'
import DatePicker from "react-datepicker";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.retrieveIssues = this.retrieveIssues.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);

    const currentDate = new Date();

    this.state = {
      content: "",
      issues: [],
      startDate: 0,
      endDate: currentDate,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    UserService.get(user.id)
      .then(response => {
        this.setState({
          currentUser: response.data
        });
        this.retrieveIssues(response.data);
      })
      .catch(e => {
        console.log(e);
      });


  }

  retrieveIssues(user) {
    if (user.type =="Technician") {
      IssueDataService.getByTechnician(user.id)
        .then(response => {
          this.setState({
            issues: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else if (user.type =="Customer") {
      IssueDataService.getByCompany(user.company.id)
        .then(response => {
          this.setState({
            issues: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      }
    }

  onChangeStartDate(e) {
    console.log(e);
    this.setState({
      startDate: e
    });

    IssueDataService.find(e.getTime(), this.state.endDate.getTime(), this.state.currentUser.company.id)
      .then(response => {
        this.setState({
          issues: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeEndDate(e) {
    console.log(e);
    this.setState({
      endDate: e
    });

    var start = 0;
    var end = 0;

    if (this.state.startDate > 0) {
      start = this.state.startDate.getTime();
    }

    if (this.state.endDate != undefined) {
      end = this.state.endDate.getTime();
    }

    IssueDataService.find(start, end, this.state.currentUser.company.id)
      .then(response => {
        this.setState({
          issues: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentUser, issues, startDate, endDate } = this.state;
    return (
      <div>
        {currentUser && (currentUser.type =="Technician" || currentUser.type =="Customer") && <div className="container">

          {issues.length > 0 &&
            <div class="card">
              <div class="card-header">
                {currentUser.type =="Technician" && <h3>Mis incidencias</h3>}
                {currentUser.type =="Customer" && <h3>Incidencias - {currentUser.company.name}</h3>}
              </div>
              <div class="card-body">

                {currentUser.type =="Customer" && <div className="well">
                  <div className="form-group row">
                    <label htmlFor="company" className="col-sm-2 col-form-label">Fecha desde</label>
                    <DatePicker
                      selected={startDate}
                      onChange={date => this.onChangeStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                      isClearable />
                    <label htmlFor="company" className="col-sm-2 col-form-label">Fecha hasta</label>
                    <DatePicker
                      selected={endDate}
                      onChange={date => this.onChangeEndDate(date)}
                      dateFormat="yyyy-MM-dd"
                      maxDate = {new Date()}
                      isClearable />
                  </div>
                </div>}

                <table className="table table-striped table-bordered table-hover">
                  <thead className="table-info">
                    <tr>
                      <th className="width20">Id</th>
                      <th className="width40">Título</th>
                      <th className="width20">Fecha</th>
                      {currentUser.type =="Technician" && <th className="width20">Empresa</th>}
                      <th className="width20">Estado</th>
                      <th className="width10">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {issues &&
                    issues.map((issue, index) => (
                      <tr>
                        <td>{issue.id}</td>
                        <td data-tip={issue.description} data-place="bottom"><ReactTooltip />{issue.title}</td>
                        <td>{new Date(issue.createDate).toLocaleDateString()}</td>
                        {currentUser.type =="Technician" && <td>{issue.company.name}</td>}
                        <td><span className={"badge badge-" + issue.status}>{issue.status}</span></td>
                        <td>
                          <Link
                            to={"/issues/" + issue.id + "/view"}
                            className="text-secondary mr-1"
                            data-tip="Ver"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                          {currentUser.type =="Technician" && <Link
                            to={"/issues/" + issue.id}
                            className="text-primary mr-1"
                            data-tip="Editar"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>}
                          {currentUser.type =="Technician" && <a
                            className="text-danger"
                            data-tip="Eliminar"
                            onClick={() => {this.deleteIssue(issue.id)}}
                          >
                            <ReactTooltip />
                            <FontAwesomeIcon icon={faTrash} />
                          </a>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
          {issues.length == 0 &&
            <div className="alert alert-warning">No tienes incidencias asignadas</div>
          }
        </div>}
        {currentUser && currentUser.type =="Administrator" &&
          <div>
            <h3>Área de mantenimiento</h3>
            <div className="row">
              <Link
                to={"/users"}
                className="container col-md-4"
              >
                <div class="card card-success">
                  <div class="card-header">
                    <div className="row">
                      <h1 className="col-md-3 text-primary"><FontAwesomeIcon icon={faUser} /></h1><h4 class="card-title col-md-9 text-dark">Usuarios</h4>
                    </div>
                  </div>
                  <div class="card-body">
                    <p class="card-text text-dark">Gestión de usuarios que tienen acceso a la plataforma</p>
                  </div>
                </div>
              </Link>
              <Link
                to={"/companies"}
                className="container col-md-4"
              >
                <div class="card">
                  <div class="card-header">
                    <div className="row">
                      <h1 className="col-md-3 text-success"><FontAwesomeIcon icon={faIndustry} /></h1><h4 class="card-title col-md-9 text-dark">Empresas</h4>
                    </div>
                    </div>

                  <div class="card-body">
                    <p class="card-text text-dark">Gestión de empresas clientes y sus máquinas</p>
                  </div>
                </div>
              </Link>
              <Link
                to={"/manufacturers"}
                className="container col-md-4"
              >
                <div class="card">
                  <div class="card-header">
                    <div className="row">
                      <h1 className="col-md-3 text-warning"><FontAwesomeIcon icon={faBoxes} /></h1><h4 class="card-title col-md-9 text-dark">Fabricantes</h4>
                    </div>
                    </div>

                  <div class="card-body">
                    <p class="card-text text-dark">Mantenimiento de fabricantes y sus productos</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        }


        </div>
    );
  }
}
