import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import CompanyDataService from "../services/company.service";
import UserDataService from "../services/user.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

export default class AddIssue extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeTechnician = this.onChangeTechnician.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.saveIssue = this.saveIssue.bind(this);
    this.newIssue = this.newIssue.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      company: null,
      technician: null,
      companies: [],
      technicians: [],

      submitted: false
    };
  }

  componentDidMount() {
    this.retrieveCompanies();
    this.retrieveTechnicians();
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  saveIssue() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      company: this.state.company,
      technician: this.state.technician
    };

    IssueDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          company: response.data.company,
          technician: response.data.technician,

          submitted: true
        });
        console.log(response.data);
        this.props.history.push('/issues/'+response.data.id+'/view')
      })
      .catch(e => {
        console.log(e);
      });
  }

  newIssue() {
    this.setState({
      id: null,
      title: "",

      submitted: false
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

  retrieveTechnicians() {
    UserDataService.getAllByType('Technician')
      .then(response => {
        console.log(response.data);
          response.data.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
          const updatedJson = JSON.stringify( response.data );
        this.setState({
          technicians: response.data
        });

      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeCompany(e) {
    this.setState({
      company: e
    });
  }

  onChangeTechnician(e) {
    this.setState({
      technician: e
    });
  }

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  render() {
    const {companies, technicians} = this.state;

    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newIssue}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <h4>Nueva incidencia</h4>
            <div className="form-group row">
              <label htmlFor="title" className="col-sm-2 col-form-label">Título</label>
              <input
                type="text"
                className="form-control col-sm-8"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="name"
              />
            </div>

            <div className="form-group row">
              <label htmlFor="description" className="col-sm-2 col-form-label">Descripción</label>
              <textarea
                rows="4"
                type="text"
                className="form-control col-sm-8"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="name"
              />
            </div>

            <div className="form-group row">
              <label htmlFor="company" className="col-sm-2 col-form-label">Empresa</label>
              <Select options={companies} className="col-sm-6" onChange={this.onChangeCompany}/>
            </div>

            <div className="form-group row">
              <label htmlFor="technician" className="col-sm-2 col-form-label">Técnico</label>
              <Select options={technicians} className="col-sm-6" onChange={this.onChangeTechnician}/>
            </div>

            <Link to={"/issues"} className="btn btn-outline-info btn-sm mr-1">
              <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
            </Link>

            <button onClick={this.saveIssue} className="btn btn-info btn-sm">
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>Crear
            </button>
          </div>
        )}
      </div>
    );
  }
}
