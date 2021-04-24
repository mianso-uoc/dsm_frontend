import React, { Component } from "react";
import MachineDataService from "../services/company.service";
import ManufacturerDataService from "../services/manufacturer.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

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

  saveMachine() {
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
            <form>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control col-sm-6"
                  id="name"
                  onChange={this.onChangeSerialNumber}
                />
              </div>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-1 col-form-label">Fabricante</label>
                <Select options={manufacturers} className="col-sm-6" onChange={this.onChangeManufacturer}/>
              </div>
              <div className="form-group row">
                <label htmlFor="name" className="col-sm-1 col-form-label">Producto</label>
                <Select options={products} className="col-sm-6" onChange={this.onChangeProduct}/>
              </div>
            </form>          

            <div>

              <Link to={"/companies"} className="btn btn-outline-info btn-sm mr-1">
                <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
              </Link>

              <button
                type="submit"
                className="btn btn-info btn-sm mr-1"
                onClick={this.saveMachine}
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
        </div>
      </div>
    );
  }
}