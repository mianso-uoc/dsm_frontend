import React, { Component } from "react";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger col-sm-6 mt-1" role="alert">
        Este campo es obligatorio
      </div>
    );
  }
};

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
      loading: false,
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

  updateManufacturer(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      ManufacturerDataService.update(
        this.state.currentManufacturer.id,
        this.state.currentManufacturer
      )
        .then(response => {
          console.log(response.data);
          this.props.history.push('/manufacturers');
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
              <Form
                onSubmit={this.updateManufacturer}
                ref={c => {
                  this.form = c;
                }}
              >
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <Input
                    type="text"
                    className="form-control col-sm-6"
                    id="name"
                    value={currentManufacturer.name}
                    onChange={this.onChangeName}
                    name="name"
                    validations={[required]}
                  />
                </div>
                <Link to={"/manufacturers"} className="btn btn-outline-info btn-sm mr-1">
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

                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.deleteManufacturer}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2"/>Eliminar
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
              <p>Please click on a Manufacturer...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
