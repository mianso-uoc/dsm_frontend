import React, { Component } from "react";
import CompanyDataService from "../services/company.service";
import LocationDataService from "../services/location.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { ToastContainer } from 'react-toastify';
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

export default class Company extends Component {
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
    this.getCompany = this.getCompany.bind(this);
    this.updateCompany = this.updateCompany.bind(this);
    this.deleteCompany = this.deleteCompany.bind(this);
    this.renameKey = this.renameKey.bind(this);

    this.state = {
      currentCompany: {
        id: null,
        name: "",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
        city: null
      },
      countries: [],
      provinces: [],
      cities: [],
      loading: false,
      message: ""
    };
  }

  componentDidMount() {
    this.getCompany(this.props.match.params.id);
    this.getCountries();
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentCompany: {
          ...prevState.currentCompany,
          name: name
        }
      };
    });
  }

  onChangeAddress(e) {
    const address = e.target.value;

    this.setState(function(prevState) {
      return {
        currentCompany: {
          ...prevState.currentCompany,
          address: address
        }
      };
    });
  }

  onChangePhone(e) {
    const phone = e.target.value;

    this.setState(function(prevState) {
      return {
        currentCompany: {
          ...prevState.currentCompany,
          phone: phone
        }
      };
    });
  }

  onChangeLatitude(e) {
    const latitude = e.target.value;

    this.setState(function(prevState) {
      return {
        currentCompany: {
          ...prevState.currentCompany,
          latitude: latitude
        }
      };
    });
  }

  onChangeLongitude(e) {
    const longitude = e.target.value;

    this.setState(function(prevState) {
      return {
        currentCompany: {
          ...prevState.currentCompany,
          longitude: longitude
        }
      };
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
    const country = e;
    LocationDataService.getProvinces(e.id)
      .then(response => {
        console.log(response.data);
        response.data.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
        this.setState(function(prevState) {
          return {
            currentCompany: {
              ...prevState.currentCompany,
              country: country
            }
          };
        });
        this.setState({
          provinces: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeProvince(e) {
    const province = e;
    LocationDataService.getCities(e.id)
      .then(response => {
        console.log(response.data);
        response.data.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
        this.setState(function(prevState) {
          return {
            currentCompany: {
              ...prevState.currentCompany,
              province: province
            }
          };
        });
        this.setState({
          cities: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeCity(e) {
    const city = e;

    this.setState(function(prevState) {
      return {
        currentCompany: {
          ...prevState.currentCompany,
          city: city
        }
      };
    });
  }

  getCompany(id, e) {
    CompanyDataService.get(id)
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

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  updateCompany(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      CompanyDataService.update(
        this.state.currentCompany.id,
        this.state.currentCompany
      )
        .then(response => {
          console.log(response.data);
          this.props.history.push('/companies')
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

  deleteCompany() {
    CompanyDataService.delete(this.state.currentCompany.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/companies')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentCompany, countries, provinces, cities } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentCompany ? (
            <div className="edit-form">
              <h4>Empresa</h4>
              <ToastContainer />
                <Form
                  onSubmit={this.updateCompany}
                  ref={c => {
                    this.form = c;
                  }}
                >
                <div className="form-group row">
                  <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
                  <div className="col-sm-11">
                    <Input
                      type="text"
                      className="form-control col-sm-6"
                      id="name"
                      value={currentCompany.name}
                      onChange={this.onChangeName}
                      validations={[required]}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="address" className="col-sm-1 col-form-label">Dirección</label>
                  <div className="col-sm-11">
                    <Input

                      type="text"
                      className="form-control col-sm-6"
                      id="address"
                      value={currentCompany.address}
                      onChange={this.onChangeAddress}
                      name="address"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="country" className="col-sm-1 col-form-label">País</label>
                  <Select options={countries} className="col-sm-6" onChange={this.onChangeCountry}/>
                </div>
                <div className="form-group row">
                  <label htmlFor="province" className="col-sm-1 col-form-label">Provincias</label>
                  <Select options={provinces} className="col-sm-6" onChange={this.onChangeProvince}/>
                </div>
                <div className="form-group row">
                  <label htmlFor="city" className="col-sm-1 col-form-label">Ciudad</label>
                  <Select options={cities} className="col-sm-6" onChange={this.onChangeCity}/>
                </div>
                <div className="form-group row">
                  <label htmlFor="phone" className="col-sm-1 col-form-label">Teléfono</label>
                  <div className="col-sm-11">
                    <Input
                      type="text"
                      className="form-control col-sm-6"
                      id="phone"
                      value={currentCompany.phone}
                      onChange={this.onChangePhone}
                      name="phone"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="latitude" className="col-sm-1 col-form-label">Latitud</label>
                  <div className="col-sm-11">
                    <Input
                      type="text"
                      className="form-control col-sm-6"
                      id="latitude"
                      value={currentCompany.latitude}
                      onChange={this.onChangeLatitude}
                      name="latitude"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="longitude" className="col-sm-1 col-form-label">Longitud</label>
                  <div className="col-sm-11">
                    <Input
                      type="text"
                      className="form-control col-sm-6"
                      id="latitude"
                      value={currentCompany.longitude}
                      onChange={this.onChangeLongitude}
                      name="latitude"
                    />
                  </div>
                </div>

                <div>

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
                    <FontAwesomeIcon icon={faEdit} className="mr-2"/>Guardar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={this.deleteCompany}
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

                </div>
              </Form>
              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Company...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
