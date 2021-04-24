import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';

export default class IssuesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.retrieveIssues = this.retrieveIssues.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveIssue = this.setActiveIssue.bind(this);
    this.searchName = this.searchName.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);

    this.state = {
      issues: [],
      currentIssue: null,
      currentIndex: -1,
      searchName: ""
    };
  }

  componentDidMount() {
    this.retrieveIssues();
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }

  retrieveIssues() {
    IssueDataService.getAll()
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

  refreshList() {
    this.retrieveIssues();
    this.setState({
      currentIssue: null,
      currentIndex: -1
    });
  }

  setActiveIssue(issue, index) {
    this.setState({
      currentIssue: issue,
      currentIndex: index
    });
  }

  searchName() {
    IssueDataService.findByName(this.state.searchName)
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

  deleteIssue(id) {
    IssueDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/issues');
        this.refreshList()
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchName, issues, currentIssue, currentIndex } = this.state;

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
            <h2 className="col-md-10">Incidencias</h2>
            <div className="col-md-2">
              <Link to={"/issues/add"} className="btn btn-info float-right">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Nuevo
              </Link>
            </div>
          </div>
          {issues.length > 0 &&
           <table className="table table-striped table-bordered table-hover">
            <thead className="table-info">
              <tr>
                <th className="width20">Id</th>
                <th className="width40">Título</th>
                <th className="width20">Fecha</th>
                <th className="width20">Estado</th>
                <th className="width10">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {issues &&
              issues.map((issue, index) => (
                <tr onClick={() => this.setActiveIssue(issue, index)} key={index}>
                  <td>{issue.id}</td>
                  <td>{issue.title}</td>
                  <td>{new Date(issue.createDate).toLocaleDateString()}</td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          }
          {issues.length == 0 &&
            <div className="alert alert-warning">No hay incidencias</div>
          }
        </div>
      </div>
    );
  }
}
