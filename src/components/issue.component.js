import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import CompanyDataService from "../services/company.service";
import UserDataService from "../services/user.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
//import Select from 'react-select'
import Select from "react-validation/build/select";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger col-sm-12 mt-1" role="alert">
        Este campo es obligatorio
      </div>
    );
  }
};

export default class Issue extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeTechnician = this.onChangeTechnician.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.getIssue = this.getIssue.bind(this);
    this.updateIssue = this.updateIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);

    this.state = {
      currentIssue: {
        id: null,
        title: "",
        description: "",
        companyId: null,
        technicianId: null,
        companies: [],
        technicians: []
      },
      loading: false,
      message: ""
    };
  }

  componentDidMount() {
    this.getIssue(this.props.match.params.id);
    this.retrieveCompanies();
    this.retrieveTechnicians();
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentIssue: {
          ...prevState.currentIssue,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState(function(prevState) {
      return {
        currentIssue: {
          ...prevState.currentIssue,
          description: description
        }
      };
    });
  }

  onChangeTechnician(e) {
    const technicianId = e.target.value;
    const technician = this.state.technicians.find(element => element.id == technicianId);
    this.setState(function(prevState) {
      return {
        technicianId: technicianId,
        currentIssue: {
          ...prevState.currentIssue,
          technician: technician
        }
      };
    });
  }

  onChangeCompany(e) {
    const companyId = e.target.value;
    const company = this.state.companies.find(element => element.id == companyId);

    this.setState(function(prevState) {
      return {
        companyId: companyId,
        currentIssue: {
          ...prevState.currentIssue,
          company: company
        }
      };
    });
  }

  getIssue(id) {
    IssueDataService.get(id)
      .then(response => {
        this.setState({
          currentIssue: response.data,
          companyId: response.data.company && response.data.company.id,
          technicianId: response.data.technician && response.data.technician.id
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

  updateIssue(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      IssueDataService.update(
        this.state.currentIssue.id,
        this.state.currentIssue
      )
        .then(response => {
          console.log(response.data);
          this.props.history.push('/issues');
          window.location.reload();
        })
        .catch(e => {
          console.log(e);
          this.setState({
            loading: false,
            message: 'Se ha producido un error'
          });
        });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  deleteIssue() {
    IssueDataService.delete(this.state.currentIssue.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/issues')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentIssue, companies, technicians, companyId, technicianId } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentIssue ? (
            <div className="edit-form">
              <h4>Fabricante</h4>
              <Form
                onSubmit={this.updateIssue}
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
                      id="name"
                      value={currentIssue.title}
                      onChange={this.onChangeTitle}
                      name="name"
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
                      validations={[required]}
                      value={currentIssue.description}
                      onChange={this.onChangeDescription}
                      name="name"
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="company" className="col-sm-2 col-form-label">Empresa</label>
                  <div className="col-sm-8">
                    <Select name="company"
                      className="col-sm-12" onChange={this.onChangeCompany}
                      value={companyId}
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
                      value={technicianId}
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
                  <FontAwesomeIcon icon={faEdit} className="mr-2"/>Guardar
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

              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Issue...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
