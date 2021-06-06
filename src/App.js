import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { faUser, faTools, faSignOutAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import UsersList from "./components/users-list.component";
import User from "./components/user.component";
import AddUser from "./components/add-user.component";

import ManufacturersList from "./components/manufacturers-list.component";
import Manufacturer from "./components/manufacturer.component";
import AddManufacturer from "./components/add-manufacturer.component";
import ManufacturerView from "./components/view-manufacturer.component";
import AddProduct from "./components/add-product.component";
import Product from "./components/product.component";

import CompaniesList from "./components/companies-list.component";
import Company from "./components/company.component";
import AddCompany from "./components/add-company.component";
import CompanyView from "./components/view-company.component";
import AddMachine from "./components/add-machine.component";
import Machine from "./components/machine.component";

import IssuesList from "./components/issues-list.component";
import IssueView from "./components/view-issue.component";
import Issue from "./components/issue.component";
import AddIssue from "./components/add-issue.component";
import AddDocument from "./components/add-document.component";
import IssueMachines from "./components/issue-machines.component";

import Home from "./components/home.component";
import Login from "./components/login.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut() {
    AuthService.logout();
    console.log(this.props);
    this.props.history.push('/login');
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-info">
          {currentUser && <a href="/home" className="navbar-brand">
            <FontAwesomeIcon icon={faTools} className="mr-2 text-dark"/>DSMantenimiento
          </a>}
          {!currentUser && <a href="/login" className="navbar-brand">
            <FontAwesomeIcon icon={faTools} className="mr-2 text-dark"/>DSMantenimiento
          </a>}
          {currentUser && currentUser.type=='Technician' && <div className="navbar-nav">
            <li className="nav-item">
              <Link to={"/issues"} className="nav-link">
                Incidencias
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/issues/add"} className="btn btn-warning ml-5">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Nueva incidencia
              </Link>
            </li>
          </div>}
          {currentUser && currentUser.type=='Administrator' && <div className="navbar-nav">
            <li className="nav-item">
          <Link to={"/users"} className="nav-link">
                Usuarios
              </Link>
            </li>
          </div>}
          {currentUser && currentUser.type=='Administrator' && <div className="navbar-nav">
            <li className="nav-item">
              <Link to={"/companies"} className="nav-link">
                Empresas
              </Link>
            </li>
          </div>}
          {currentUser && currentUser.type=='Administrator' && <div className="navbar-nav">
            <li className="nav-item">
              <Link to={"/manufacturers"} className="nav-link">
                Fabricantes
              </Link>
            </li>
          </div>}
          {currentUser && <div className="navbar-nav ml-auto">
            <NavDropdown title={currentUser.name} id="basic-nav-dropdown">
              <NavDropdown.Header><FontAwesomeIcon icon={faUser} className="mr-2"/>{currentUser.email}<p>
                <span className={"badge badge-" + currentUser.type}>
                  {currentUser.type == "Customer" && "CLIENTE"}
                  {currentUser.type == "Administrator" && "ADMINISTRADOR"}
                  {currentUser.type == "Technician" && "TÉCNICO"}
                  </span>
                </p></NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login" onClick={() => {this.logOut()}}><FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          </div>}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/"]} component={Login} />
            <Route exact path={["/login"]} component={Login} />
            <PrivateRoute exact path={["/home"]} component={Home} />
            <PrivateRoute exact path={["/users"]} component={UsersList} />
            <PrivateRoute exact path="/users/add" component={AddUser} />
            <PrivateRoute path="/users/:id" component={User} />
            <PrivateRoute exact path={["/manufacturers"]} component={ManufacturersList} />
            <PrivateRoute exact path="/manufacturers/add" component={AddManufacturer} />
            <PrivateRoute path="/manufacturers/:id/view" component={ManufacturerView} />
            <PrivateRoute path="/manufacturers/:id/addProduct" component={AddProduct} />
            <PrivateRoute path="/manufacturers/:id" component={Manufacturer} />
            <PrivateRoute path="/products/:id" component={Product} />

            <PrivateRoute exact path={["/companies"]} component={CompaniesList} />
            <PrivateRoute exact path="/companies/add" component={AddCompany} />
            <PrivateRoute path="/companies/:id/view" component={CompanyView} />
            <PrivateRoute path="/companies/:id/addMachine" component={AddMachine} />
            <PrivateRoute path="/companies/:id" component={Company} />
            <PrivateRoute path="/machines/:id" component={Machine} />

            <PrivateRoute exact path={["/issues"]} component={IssuesList} />
            <PrivateRoute path="/issues/:id/view" component={IssueView} />
            <PrivateRoute exact path="/issues/add" component={AddIssue} />
            <PrivateRoute exact path="/issues/:id" component={Issue} />
            <PrivateRoute exact path="/issues/:id/addDocument" component={AddDocument} />
            <PrivateRoute exact path="/issues/:id/machines" component={IssueMachines} />
            <Route exact path={["*"]} component={Login} />

          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
