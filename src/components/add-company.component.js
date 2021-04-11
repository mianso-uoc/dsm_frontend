import React, { Component } from "react";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUndo } from '@fortawesome/free-solid-svg-icons'

export default class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.saveCompany = this.saveCompany.bind(this);
    this.newCompany = this.newCompany.bind(this);

    this.state = {
      id: null,
      name: "",

      submitted: false
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  saveCompany() {
    var data = {
      name: this.state.name
    };

    CompanyDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,

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

  render() {
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
            <h4>Nuevo fabricante</h4>
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