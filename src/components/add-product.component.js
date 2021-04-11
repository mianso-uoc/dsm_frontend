import React, { Component } from "react";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger mt-1" role="alert">
        Este campo es obligatorio
      </div>
    );
  }
};

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.getManufacturer = this.getManufacturer.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.newProduct = this.newProduct.bind(this);

    this.state = {
      currentManufacturer: {
        id: null,
        name: ""
      },
      id: null,
      name: "",

      submitted: false
    };
  }

  componentDidMount() {
    this.getManufacturer(this.props.match.params.id);
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

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  saveProduct(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      var data = {
        name: this.state.name,
        manufacturer: this.state.currentManufacturer
      };

      ManufacturerDataService.createProduct(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            name: response.data.name,

            submitted: true
          });
          console.log(response.data);
          this.props.history.push('/manufacturers/' + this.state.currentManufacturer.id + "/view")
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  newProduct() {
    this.setState({
      id: null,
      name: "",

      submitted: false
    });
  }

  render() {
    const { currentManufacturer } = this.state;
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newProduct}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <h4>{currentManufacturer.name} Nuevo producto</h4>

            <Form
              onSubmit={this.saveProduct}
              ref={c => {
                this.form = c;
              }}
            >

              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <Input
                  type="text"
                  className="form-control col-sm-6"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <Link to={"/manufacturers/" + currentManufacturer.id + "/view"} className="btn btn-outline-info btn-sm mr-1">
                  <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
                </Link>
                <button
                  className="btn btn-info btn-sm"
                  disabled={this.state.loading}
                >
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <FontAwesomeIcon icon={faPlus} className="mr-2"/>Crear                  
                </button>
              </div>

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