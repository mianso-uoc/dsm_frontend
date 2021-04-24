import React, { Component } from "react";
import CompanyDataService from "../services/company.service";
import LocationDataService from "../services/location.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

export default class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeLatitude = this.onChangeLatitude.bind(this);
    this.onChangeLongitude = this.onChangeLongitude.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeProvince = this.onChangeProvince.bind(this);
    this.onChangeCity = this.onChangeCity.bind(this);
    this.getCountries = this.getCountries.bind(this);
    this.saveCompany = this.saveCompany.bind(this);
    this.newCompany = this.newCompany.bind(this);
    this.renameKey = this.renameKey.bind(this);

    this.state = {
      id: null,
      name: "",
      address: "",
      phone: "",
      latitude: "",
      longitude: "",
      city: null,
      countries: [],
      provinces: [],
      cities: [],

      submitted: false
    };
  }

  componentDidMount() {
    this.getCountries();
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }

  onChangePhone(e) {
    this.setState({
      phone: e.target.value
    });
  }

  onChangeLatitude(e) {
    this.setState({
      latitude: e.target.value
    });
  }

  onChangeLongitude(e) {
    this.setState({
      longitude: e.target.value
    });
  }

  getCountries() {
    LocationDataService.getCountries()
      .then(response => {
        console.log(response.data);
          response.data.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
        this.setState({
          countries: response.data
        });

      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeCountry(e) {
    const lista = e.provinces;
    lista.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
    this.setState(function(prevState) {
      return {
        provinces: lista
      };
    });
  }

  onChangeProvince(e) {
    const lista = e.cities;
    lista.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
    this.setState(function(prevState) {
      return {
        cities: lista
      };
    });
  }

  onChangeCity(e) {
    this.setState({
      city: e
    });
  }

  saveCompany() {
    var data = {
      name: this.state.name,
      address: this.state.address,
      phone: this.state.phone,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      city: this.state.city
    };

    CompanyDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          address: response.data.address,
          phone: response.data.phone,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          city: response.data.city,

          submitted: true
        });
        console.log(response.data);
        this.props.history.push('/companies')
      })
      .catch(e => {
        console.log(e);
      });
  }

  newCompany() {
    this.setState({
      id: null,
      name: "",

      submitted: false
    });
  }

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  render() {

    const { countries, provinces, cities } = this.state;
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newCompany}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <h4>Nueva empresa</h4>
            <div className="form-group row">
              <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="name"
                required
                value={this.state.name}
                onChange={this.onChangeName}
                name="name"
              />
            </div>
            <div className="form-group row">
              <label htmlFor="address" className="col-sm-1 col-form-label">Dirección</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="address"
                required
                value={this.state.address}
                onChange={this.onChangeAddress}
                name="address"
              />
            </div>
            <div className="form-group row">
              <label htmlFor="country" className="col-sm-1 col-form-label">País</label>
              <Select options={countries} className="col-sm-6" onChange={this.onChangeCountry}/>
            </div>
            <div className="form-group row">
              <label htmlFor="country" className="col-sm-1 col-form-label">Provincias</label>
              <Select options={provinces} className="col-sm-6" onChange={this.onChangeProvince}/>
            </div>
            <div className="form-group row">
              <label htmlFor="city" className="col-sm-1 col-form-label">Ciudad</label>
              <Select options={cities} className="col-sm-6" onChange={this.onChangeCity}/>
            </div>
            <div className="form-group row">
              <label htmlFor="phone" className="col-sm-1 col-form-label">Teléfono</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="phone"
                required
                value={this.state.phone}
                onChange={this.onChangePhone}
                name="phone"
              />
            </div>
            <div className="form-group row">
              <label htmlFor="latitude" className="col-sm-1 col-form-label">Latitud</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="latitude"
                required
                value={this.state.latitude}
                onChange={this.onChangeLatitude}
                name="latitude"
              />
            </div>
            <div className="form-group row">
              <label htmlFor="longitude" className="col-sm-1 col-form-label">Longitud</label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="longitude"
                required
                value={this.state.longitude}
                onChange={this.onChangeLongitude}
                name="longitude"
              />
            </div>

            <Link to={"/companies"} className="btn btn-outline-info btn-sm mr-1">
              <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
            </Link>

            <button onClick={this.saveCompany} className="btn btn-info btn-sm">
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>Crear
            </button>
          </div>
        )}
      </div>
    );
  }
}
