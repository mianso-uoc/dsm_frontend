import React, { Component } from "react";
import UserDataService from "../services/user.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'

export default class User extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeCompanyId = this.onChangeCompanyId.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      currentUser: {
        id: null,
        name: "",
        email: "",
        type: "Administrator",
        companyId: 1
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getUser(this.props.match.params.id);
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
  onChangeCompanyId(e) {
    const companyId = e.target.value;

    this.setState(function(prevState) {
      return {
        currentUser: {
          ...prevState.currentUser,
          companyId: companyId
        }
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
          this.state.customerId = response.data.customer.id;
        }
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateUser() {
    UserDataService.update(
      this.state.currentUser.id,
      this.state.currentUser
    )
      .then(response => {
        console.log(response.data);
        console.log("UPDATE")
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

  render() {
    const { currentUser } = this.state;

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
                  <select
                    className="form-control col-sm-6"
                    id="companyId"
                    required 
                    value={currentUser.companyId}
                    onChange={this.onChangeCompanyId}
                    name="companyId"
                  >
                    <option value="1">1</option>
                  </select>
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