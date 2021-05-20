import React, { Component } from "react";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger col-sm-6 mt-1" role="alert">
        Este campo es obligatorio
      </div>
    );
  }
};

export default class AddManufacturer extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.saveManufacturer = this.saveManufacturer.bind(this);
    this.newManufacturer = this.newManufacturer.bind(this);

    this.state = {
      id: null,
      name: "",
      message: ""
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  saveManufacturer(e) {
    e.preventDefault();

    this.setState({
      message: ""
    });

    var data = {
      name: this.state.name
    };

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      ManufacturerDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            name: response.data.name
          });
          console.log(response.data);
          toast.success('Se ha creado el fabricante', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
          this.props.history.push('/manufacturers');
          //window.location.reload();
        })
        .catch(e => {
          console.log(e);
          this.setState({
            message: 'Se ha producido un error'
          });
        });
    }
  }

  newManufacturer() {
    this.setState({
      id: null,
      name: "",

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form"><ToastContainer />
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newManufacturer}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <h4>Nuevo fabricante</h4>

            <Form
              onSubmit={this.saveManufacturer}
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
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
                validations={[required]}
              />
            </div>

            <Link to={"/manufacturers"} className="btn btn-outline-info btn-sm mr-1">
              <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
            </Link>


            <button
              className="btn btn-info btn-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>Crear
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

          </div>
        )}
      </div>
    );
  }
}
