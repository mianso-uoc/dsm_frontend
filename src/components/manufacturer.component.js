import React, { Component } from "react";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'

export default class Manufacturer extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.getManufacturer = this.getManufacturer.bind(this);
    this.updateManufacturer = this.updateManufacturer.bind(this);
    this.deleteManufacturer = this.deleteManufacturer.bind(this);

    this.state = {
      currentManufacturer: {
        id: null,
        name: ""
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getManufacturer(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentManufacturer: {
          ...prevState.currentManufacturer,
          name: name
        }
      };
    });
  }

  getManufacturer(id) {
    ManufacturerDataService.get(id)
      .then(response => {
        this.setState({
          currentManufacturer: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateManufacturer() {
    ManufacturerDataService.update(
      this.state.currentManufacturer.id,
      this.state.currentManufacturer
    )
      .then(response => {
        console.log(response.data);
        this.props.history.push('/manufacturers')
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteManufacturer() {    
    ManufacturerDataService.delete(this.state.currentManufacturer.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/manufacturers')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentManufacturer } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentManufacturer ? (
            <div className="edit-form">
              <h4>Fabricante</h4>
              <form>
                <div className="form-group row">
                  <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control col-sm-6"
                    id="name"
                    value={currentManufacturer.name}
                    onChange={this.onChangeName}
                  />
                </div>
              </form>          

              <div>

                <Link to={"/manufacturers"} className="btn btn-outline-info btn-sm mr-1">
                  <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
                </Link>

                <button
                  type="submit"
                  className="btn btn-info btn-sm mr-1"
                  onClick={this.updateManufacturer}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2"/>Guardar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.deleteManufacturer}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2"/>Eliminar
                </button>
              </div>

              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Manufacturer...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}