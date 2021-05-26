import React, { Component } from "react";
import UserDataService from "../services/user.service";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class UsersList extends Component {
  constructor(props) {
    super(props);
    this.retrieveUsers = this.retrieveUsers.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      users: [],
      currentUser: null,
      currentIndex: -1
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
    this.retrieveUsers();
  }

  retrieveUsers() {
    UserDataService.getAll()
      .then(response => {
        this.setState({
          users: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveUsers();
  }

  deleteUser(id) {
    UserDataService.delete(id)
      .then(response => {
        console.log(response.data);
        toast.success('Se ha eliminado el usuario', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        this.props.history.push('/users');
        this.refreshList();
      })
      .catch(e => {
        toast.error('Se ha producido un error al eliminar el usuario', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        console.log(e);
      });
  }

  render() {
    const { users, currentUser } = this.state;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <h2 className="col-md-10">Usuarios</h2>
            <ToastContainer />
            <div className="col-md-2">
              <Link to={"/users/add"} className="btn btn-info float-right">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Nuevo
              </Link>
            </div>
          </div>
          {users.length > 0 &&
           <table className="table table-striped table-bordered table-hover">
            <thead className="table-info">
              <tr>
                <th className="width10">Id</th>
                <th className="width20">Nombre</th>
                <th className="width20">Email</th>
                <th className="width10">Rol</th>
                <th className="width10">Empresa</th>
                <th className="width10"></th>
              </tr>
            </thead>

            <tbody>
              {users &&
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={"badge badge-" + user.type}>
                    {user.type == "Customer" && "CLIENTE"}
                    {user.type == "Administrator" && "ADMINISTRADOR"}
                    {user.type == "Technician" && "TÉCNICO"}
                    </span></td>
                  <td>
                    {user.type == 'Customer'&& user.company.name}
                  </td>
                  <td>
                    <Link
                      to={"/users/" + user.id}
                      className="btn btn-sm btn-info mr-1"
                      data-tip="Editar"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    {currentUser && currentUser.id != user.id && <button
                      className="btn btn-sm btn-danger"
                      data-tip="Eliminar"
                      onClick={() => {this.deleteUser(user.id)}}
                    >
                      <ReactTooltip />
                      <FontAwesomeIcon icon={faTrash} />
                    </button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          }

          {users.length == 0 &&
            <div className="alert alert-warning">No hay usuarios</div>
          }

        </div>
      </div>
    );
  }
}
