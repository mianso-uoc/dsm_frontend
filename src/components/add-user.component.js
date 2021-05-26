import React, { Component } from "react";
import UserDataService from "../services/user.service";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.newUser = this.newUser.bind(this);

    this.state = {
      id: null,
      name: "",
      email: "",
      password: "",
      type: "Administrator",
      company: null,
      companies: [],

      submitted: false
    };
  }

  componentDidMount() {
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
    this.setState({
      name: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  onChangeType(e) {
    this.setState({
      type: e.target.value
    });
  }
  onChangeCompany(e) {
    this.setState({
      company: e
    });
  }

  saveUser() {
    var data = {
      id: 0,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      type: this.state.type
    };

    var companyId = 0;
    if (this.state.company) {
      companyId = this.state.company.id;
    }

    UserDataService.create(data, companyId)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          password: response.data.password,
          type: response.data.type,
          companyId: response.data.companyId,

          submitted: true
        });
        console.log(response.data);
        this.props.history.push('/users')
      })
      .catch(e => {
        toast.error('Se ha producido un error al crear el usuario', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      });
  }

  newUser() {
    this.setState({
      id: null,
      name: "",
      email: "",
      password: "",
      type: "Administrator",
      company: null,

      submitted: false
    });
  }

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  render() {
    const {companies} = this.state;
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newUser}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <h4>Nuevo Usuario</h4>
            <ToastContainer />
            <div className="form-group row">
              <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="name"
                required
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>

            <div className="form-group row">
              <label htmlFor="email" className="col-sm-1 col-form-label">Email</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="email"
                required
                value={this.state.email}
                onChange={this.onChangeEmail}
                name="email"
              />
            </div>

            <div className="form-group row">
              <label htmlFor="password" className="col-sm-1 col-form-label">Password</label>
              <input
                type="password"
                className="form-control col-sm-6"
                id="password"
                required
                value={this.state.password}
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
                value={this.state.type}
                onChange={this.onChangeType}
                name="type"
              >
                <option value="Administrator">Administrador</option>
                <option value="Customer">Cliente</option>
                <option value="Technician">Técnico</option>
              </select>
            </div>

            {this.state.type == 'Customer' && <div className="form-group row">
              <label htmlFor="companyId" className="col-sm-1 col-form-label">Empresa</label>
              <Select options={companies} className="col-sm-6" onChange={this.onChangeCompany}/>
            </div>}

            <Link to={"/users"} className="btn btn-outline-info btn-sm mr-1">
              <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
            </Link>

            <button onClick={this.saveUser} className="btn btn-info btn-sm">
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>Crear
            </button>
          </div>
        )}
      </div>
    );
  }
}
