import React, { Component } from "react";
import UserDataService from "../services/user.service";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

export default class User extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      currentUser: {
        id: null,
        name: "",
        email: "",
        password: "",
        type: "Administrator",
        companyId: null,
        companies: []
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getUser(this.props.match.params.id);
      this.retrieveCompanies();
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

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentUser: {
          ...prevState.currentUser,
          name: name
        }
      };
    });
  }
  onChangeEmail(e) {
    const email = e.target.value;

    this.setState(function(prevState) {
      return {
        currentUser: {
          ...prevState.currentUser,
          email: email
        }
      };
    });
  }

  onChangePassword(e) {
    const password = e.target.value;

    this.setState(function(prevState) {
      return {
        currentUser: {
          ...prevState.currentUser,
          password: password
        }
      };
    });
  }

  onChangeType(e) {
    const type = e.target.value;

    this.setState(function(prevState) {
      return {
        currentUser: {
          ...prevState.currentUser,
          type: type
        }
      };
    });
  }
  onChangeCompany(e) {
    const company = e;

    this.setState(function(prevState) {
      return {
        currentUser: {
          ...prevState.currentUser,
          company: company
        },
        companyId: company.id
      };
    });
  }


  getUser(id) {
    UserDataService.get(id)
      .then(response => {
        this.setState({
          currentUser: response.data
        });
        if (this.state.type == "Administrator") {
          this.setState({
            customerId: response.data.customer.id
          });
        }
        this.state.currentUser.password = "";
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateUser() {
    UserDataService.update(
      this.state.currentUser.id,
      this.state.currentUser,
      this.state.companyId
    )
      .then(response => {
        console.log(response.data);
        this.props.history.push('/users')
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteUser() {
    UserDataService.delete(this.state.currentUser.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/users')
      })
      .catch(e => {
        console.log(e);
      });
  }

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  render() {
    const { currentUser, companies } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentUser ? (
            <div className="edit-form">
              <h4>Usuario {currentUser.id}</h4>
              <form>
                <div className="form-group row">
                  <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control col-sm-6"
                    id="name"
                    value={currentUser.name}
                    onChange={this.onChangeName}
                  />
                </div>

                <div className="form-group row">
                  <label htmlFor="email" className="col-sm-1 col-form-label">Email</label>
                  <input
                    type="text"
                    className="form-control col-sm-6"
                    id="email"
                    required
                    value={currentUser.email}
                    onChange={this.onChangeEmail}
                    name="email"
                  />
                </div>

                <div className="form-group row">
                  <label htmlFor="email" className="col-sm-1 col-form-label">Password</label>
                  <input
                    type="text"
                    className="form-control col-sm-6"
                    id="email"
                    required
                    value={currentUser.password}
                    onChange={this.onChangePassword}
                    name="email"
                  />
                </div>

                <div className="form-group row">
                  <label htmlFor="type" className="col-sm-1 col-form-label">Rol</label>
                  <select
                    className="form-control col-sm-6"
                    id="type"
                    required
                    value={currentUser.type}
                    onChange={this.onChangeType}
                    name="type"
                  >
                    <option value="Administrator">Administrador</option>
                    <option value="Customer">Cliente</option>
                    <option value="Technician">Técnico</option>
                  </select>
                </div>

                {currentUser.type == 'Customer' && <div className="form-group row">
                  <label htmlFor="companyId" className="col-sm-1 col-form-label">Empresa</label>
                  <Select options={companies} className="col-sm-6" onChange={this.onChangeCompany}/>
                </div>}

              </form>

              <div>

                <Link to={"/users"} className="btn btn-outline-info btn-sm mr-1">
                  <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
                </Link>

                <button
                  type="submit"
                  className="btn btn-info btn-sm mr-1"
                  onClick={this.updateUser}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2"/>Guardar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.deleteUser}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2"/>Eliminar
                </button>
              </div>

              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a User...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
