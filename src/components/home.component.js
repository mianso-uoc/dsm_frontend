import React, { Component } from "react";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import IssueDataService from "../services/issue.service";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.retrieveIssues = this.retrieveIssues.bind(this);

    this.state = {
      content: "",
      issues: []
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
    this.retrieveIssues(user);
  }

  retrieveIssues(user) {
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
  }

  render() {
    const { currentUser, issues } = this.state;
    return (
      <div>
        {currentUser && currentUser.type =="Technician" && <div className="container">
          
          {issues.length > 0 &&
            <div class="card">
              <div class="card-header">
                <h3>Mis incidencias</h3>
              </div>
              <div class="card-body">
                <table className="table table-striped table-bordered table-hover">
                  <thead className="table-info">
                    <tr>
                      <th className="width20">Id</th>
                      <th className="width40">Título</th>
                      <th className="width20">Fecha</th>
                      <th className="width20">Empresa</th>
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
                        <td>{issue.company.name}</td>
                        <td><span className={"badge badge-" + issue.status}>{issue.status}</span></td>
                        <td>
                          <Link
                            to={"/issues/" + issue.id + "/view"}
                            className="text-secondary mr-1"
                            data-tip="Ver"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                          <Link
                            to={"/issues/" + issue.id}
                            className="text-primary mr-1"
                            data-tip="Editar"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <a
                            className="text-danger"
                            data-tip="Eliminar"
                            onClick={() => {this.deleteIssue(issue.id)}}
                          >
                            <ReactTooltip />
                            <FontAwesomeIcon icon={faTrash} />
                          </a>
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
        </div>   
    );
  }
}