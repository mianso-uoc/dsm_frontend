import React, { Component } from "react";
import MachineDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Machine extends Component {
  constructor(props) {
    super(props);
    this.onChangeSerialNumber = this.onChangeSerialNumber.bind(this);
    this.getMachine = this.getMachine.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.updateMachine = this.updateMachine.bind(this);
    this.deleteMachine = this.deleteMachine.bind(this);

    this.state = {
      currentMachine: {
        id: null,
        serialNumber: ""
      },
      currentCompany: null,
      message: ""
    };
  }

  componentDidMount() {
    this.getMachine(this.props.match.params.id);
    this.getCompany(this.props.match.params.id);
  }

  onChangeSerialNumber(e) {
    const serialNumber = e.target.value;

    this.setState(function(prevState) {
      return {
        currentMachine: {
          ...prevState.currentMachine,
          serialNumber: serialNumber
        }
      };
    });
  }

  getMachine(id) {
    MachineDataService.getMachine(id)
      .then(response => {
        this.setState({
          currentMachine: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getCompany(id) {
    MachineDataService.getByMachine(id)
      .then(response => {
        this.setState({
          currentCompany: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateMachine() {
    MachineDataService.updateMachine(
      this.state.currentMachine.id,
      this.state.currentMachine
    )
      .then(response => {
        console.log(response.data);
        toast.success('Se ha guardado la máquina ', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        //this.props.history.push('/companies/' + this.state.currentCompany.id + '/view');
      })
      .catch(e => {
        toast.error('Se ha producido un error al guardar la máquina', {
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

  deleteMachine() {
    MachineDataService.deleteMachine(this.state.currentMachine.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/companies/' + this.state.currentCompany.id + "/view")
      })
      .catch(e => {
        toast.error('Se ha producido un error al eliminar la máquina', {
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
    const { currentMachine, currentCompany } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentMachine ? (
            <div className="edit-form">
              <h4>Fabricante {currentCompany && currentCompany.name}</h4>
              <ToastContainer />
              <form>
                <div className="form-group row">
                  <label htmlFor="name" className="col-sm-1 col-form-label">Número de serie</label>
                  <input
                    type="text"
                    className="form-control col-sm-6"
                    id="name"
                    value={currentMachine.serialNumber}
                    onChange={this.onChangeSerialNumber}
                  />
                </div>
              </form>

              <div>

                {currentCompany && <Link to={"/companies/" + currentCompany.id + "/view"} className="btn btn-outline-info btn-sm mr-1">
                  <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
                </Link>}

                <button
                  type="submit"
                  className="btn btn-info btn-sm mr-1"
                  onClick={this.updateMachine}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2"/>Guardar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.deleteMachine}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2"/>Eliminar
                </button>
              </div>

              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Machine...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
