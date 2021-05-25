import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"

export default class IssuesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.retrieveIssues = this.retrieveIssues.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveIssue = this.setActiveIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);

    const currentDate = new Date();

    this.state = {
      issues: [],
      currentIssue: null,
      currentIndex: -1,
      startDate: 0,
      endDate: currentDate,
      company: null
    };
  }

  componentDidMount() {
    this.retrieveIssues();
    this.retrieveCompanies();
  }

  onChangeStartDate(e) {
    console.log(e);
    this.setState({
      startDate: e
    });

    var companyId = null;

    if (this.state.company != undefined) {
      companyId = this.state.company.id;
    }

    var start = 0;
    var end = 0;

    if (e != null) {
      start = e.getTime();
    }

    if (this.state.endDate != null) {
      end = this.state.endDate.getTime();
    } else {
      end = (new Date()).getTime();
    }

    IssueDataService.find(start, end, companyId)
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
    var companyId;

    if (this.state.startDate > 0) {
      start = this.state.startDate.getTime();
    }

    if (e != undefined) {
      end = e.getTime();
    } else {
      end = (new Date()).getTime();
    }

    if (this.state.company != undefined) {
      companyId = this.state.company.id;
    }

    IssueDataService.find(start, end, companyId)
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

  onChangeCompany(e) {
    this.setState({
      company: e
    });

    var start = 0;
    var end = 0;

    if (this.state.startDate > 0) {
      start = this.state.startDate.getTime();
    }

    if (this.state.endDate != undefined) {
      end = this.state.endDate.getTime();
    }

    IssueDataService.find(start, end, e.id)
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

  retrieveCompanies() {
    CompanyDataService.getAll()
      .then(response => {
        console.log(response.data);
          response.data.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
          const updatedJson = JSON.stringify( response.data );
        this.setState({
          companies: response.data
        });

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

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  render() {
    const { issues, companies, startDate, endDate } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <h2 className="col-md-10">Incidencias</h2>
          </div>
          <div className="well">
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
                todayButton="Hoy"
                isClearable />
            </div>
            <div className="form-group row">
              <label htmlFor="company" className="col-sm-2 col-form-label">Empresa</label>
              <Select options={companies} className="col-sm-5" onChange={this.onChangeCompany}/>
            </div>
          </div>

          {issues.length > 0 &&
           <table className="table table-striped table-bordered table-hover">
            <thead className="table-info">
              <tr>
                <th className="width10">Id</th>
                <th className="width40">Título</th>
                <th className="width10">Fecha</th>
                <th className="width20">Técnico asignado</th>
                <th className="width20">Empresa</th>
                <th className="width10">Estado</th>
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
                  <td>{issue.technician && issue.technician.name}</td>
                  <td>{issue.company && issue.company.name}</td>
                  <td><span className={"badge badge-" + issue.status}>
                    {issue.status == 'PENDING' && 'PENDIENTE'}
                    {issue.status == 'CLOSED' && 'CERRADA'}
                    {issue.status == 'SOLVED' && 'RESUELTA'}</span></td>
                  <td>
                    <Link
                      to={"/issues/" + issue.id + "/view"}
                      className="text-dark mr-1"
                      data-tip="Ver"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    {issue.status == 'PENDING' && <Link
                      to={"/issues/" + issue.id}
                      className="text-primary mr-1"
                      data-tip="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>}
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
