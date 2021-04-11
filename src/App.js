import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { faUser, faTools, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
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
          {currentUser && currentUser.type=='Administrator' && <a href="/users" className="navbar-brand">
            <FontAwesomeIcon icon={faTools} className="mr-2 text-dark"/>DSMantenimiento
          </a>}
          {currentUser && currentUser.type=='Technician' && <a href="/users" className="navbar-brand">
            <FontAwesomeIcon icon={faTools} className="mr-2 text-dark"/>DSMantenimiento
          </a>}
          {currentUser && currentUser.type=='Customer' && <a href="/users" className="navbar-brand">
            <FontAwesomeIcon icon={faTools} className="mr-2 text-dark"/>DSMantenimiento
          </a>}
          {!currentUser && <a href="/login" className="navbar-brand">
            <FontAwesomeIcon icon={faTools} className="mr-2 text-dark"/>DSMantenimiento
          </a>}
          {currentUser && currentUser.type=='Technician' && <div className="navbar-nav">
            <li className="nav-item">
              <Link to={"/manufacturers"} className="nav-link">
                Incidencias
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
              <NavDropdown.Header><FontAwesomeIcon icon={faUser} className="mr-2"/>{currentUser.email}<p><span className="badge badge-warning mr-2">{currentUser.type}</span></p></NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login" onClick={() => {this.logOut()}}><FontAwesomeIcon icon={faSignOutAlt} className="mr-2"/>Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          </div>}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/login"]} component={Login} />
            <Route exact path={["/users"]} component={UsersList} />
            <Route exact path="/users/add" component={AddUser} />
            <Route path="/users/:id" component={User} />
            <Route exact path={["/", "/manufacturers"]} component={ManufacturersList} />
            <Route exact path="/manufacturers/add" component={AddManufacturer} />
            <Route path="/manufacturers/:id/view" component={ManufacturerView} />
            <Route path="/manufacturers/:id/addProduct" component={AddProduct} />
            <Route path="/manufacturers/:id" component={Manufacturer} />
            <Route path="/products/:id" component={Product} />

            <Route exact path={["/companies"]} component={CompaniesList} />
            <Route exact path="/companies/add" component={AddCompany} />
            <Route path="/companies/:id/view" component={CompanyView} />
            <Route path="/companies/:id" component={Company} />

          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
