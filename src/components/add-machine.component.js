import React, { Component } from "react";
import MachineDataService from "../services/company.service";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger col-sm-12 mt-1" role="alert">
        Este campo es obligatorio
      </div>
    );
  }
};

export default class AddMachine extends Component {
  constructor(props) {
    super(props);
    this.onChangeSerialNumber = this.onChangeSerialNumber.bind(this);
    this.onChangeManufacturer = this.onChangeManufacturer.bind(this);
    this.onChangeProduct = this.onChangeProduct.bind(this);
    this.saveMachine = this.saveMachine.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.renameKey = this.renameKey.bind(this);

    this.state = {
      id: null,
      serialNumber: "",
      product: null,
      company: null,
      submitted: false,
      currentManufacturer: null,
      manufacturers: [],
      products: []
    };
  }

  componentDidMount() {
    this.getCompany(this.props.match.params.id);
    this.retrieveManufacturers();
  }

  saveMachine(e) {

    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {

      var data = {
        serialNumber: this.state.serialNumber,
        product: this.state.product,
        company: this.state.company
      };

      console.log("AAAAA: " + JSON.stringify(data))

      MachineDataService.createMachine(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            serialNumber: response.data.serialNumber,
            product: response.data.product,
            company: response.data.company,

            submitted: true
          });
          console.log(response.data);
          this.props.history.push('/companies/'+ this.props.match.params.id + "/view");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  onChangeSerialNumber(e) {
    this.setState({
      serialNumber: e.target.value
    });
  }

  onChangeManufacturer(e) {
    const lista = e.products;
    lista.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
    this.setState(function(prevState) {
      return {
        products: lista
      };
    });
  }

  onChangeProduct(e) {
    this.setState({
      product: e
    });
  }

  getCompany(id) {
    MachineDataService.get(id)
      .then(response => {
        this.setState({
          company: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveManufacturers() {
    ManufacturerDataService.getAll()
      .then(response => {
        console.log(response.data);
          response.data.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
          const updatedJson = JSON.stringify( response.data );
        this.setState({
          manufacturers: response.data
        });

      })
      .catch(e => {
        console.log(e);
      });
  }

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  render() {
    const { company, manufacturers, products } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="edit-form">
            {company && <h4>Nueva máquina - Empresa {company.name}</h4>}
            <Form
              onSubmit={this.saveMachine}
              ref={c => {
                this.form = c;
              }}
            >
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Número de serie</label>
                <div className="col-sm-6">
                  <Input
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={this.onChangeSerialNumber}
                    validations={[required]}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Fabricante</label>
                <Select options={manufacturers} className="col-sm-6" onChange={this.onChangeManufacturer}/>
              </div>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Producto</label>
                <Select options={products} className="col-sm-6" onChange={this.onChangeProduct}/>
              </div>

              <Link to={"/companies"} className="btn btn-outline-info btn-sm mr-1">
                <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
              </Link>

              <button
                className="btn btn-info btn-sm mr-1"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
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
        </div>
      </div>
    );
  }
}
