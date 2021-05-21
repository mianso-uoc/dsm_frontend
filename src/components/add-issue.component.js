import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import CompanyDataService from "../services/company.service";
import UserDataService from "../services/user.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger col-sm-12 mt-1" role="alert">
        Este campo es obligatorio
      </div>
    );
  }
};

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

  onChangeTechnician(e) {
    const technicianId = e.target.value;
    const technician = this.state.technicians.find(element => element.id == technicianId);
console.log(technician);
    this.setState({
      technician: technician
    });
  }

  onChangeCompany(e) {
    const companyId = e.target.value;
    const company = this.state.companies.find(element => element.id == companyId);

    this.setState({
      company: company
    });
  }

  saveIssue(e) {

    e.preventDefault();

    this.setState({
      message: ""
    });

    var data = {
      title: this.state.title,
      description: this.state.description,
      company: this.state.company,
      technician: this.state.technician
    };

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      console.log(data);
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
            <Form
              onSubmit={this.saveIssue}
              ref={c => {
                this.form = c;
              }}
            >
              <div className="form-group row">
                <label htmlFor="title" className="col-sm-2 col-form-label">Título</label>
                <div className="col-sm-8">
                  <Input
                    type="text"
                    className="form-control"
                    id="title"
                    value={this.state.title}
                    onChange={this.onChangeTitle}
                    name="title"
                    validations={[required]}
                  />
                  </div>
              </div>

              <div className="form-group row">
                <label htmlFor="description" className="col-sm-2 col-form-label">Descripción</label>
                <div className="col-sm-8">
                  <Textarea
                    rows="5"
                    type="text"
                    className="form-control"
                    id="description"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    name="description"
                    validations={[required]}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="company" className="col-sm-2 col-form-label">Empresa</label>
                <div className="col-sm-8">
                  <Select name="company"
                    className="col-sm-12" onChange={this.onChangeCompany}
                  validations={[required]}>
                    <option value=''></option>
                  {companies &&
                  companies.map((company, index) => (
                    <option value={company.id}>{company.name}</option>
                  ))}
                  </Select>
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="technician" className="col-sm-2 col-form-label">Técnico</label>
                <div className="col-sm-8">
                  <Select name="company"
                    className="col-sm-12" onChange={this.onChangeTechnician}
                  validations={[required]}>
                    <option value=''></option>
                  {technicians &&
                  technicians.map((technician, index) => (
                    <option value={technician.id}>{technician.name}</option>
                  ))}
                  </Select>
                </div>
              </div>

              <Link to={"/issues"} className="btn btn-outline-info btn-sm mr-1">
                <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
              </Link>

              <button
                className="btn btn-info btn-sm mr-1"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>Crear
              </button>

              {this.state.message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
        )}
      </div>
    );
  }
}
