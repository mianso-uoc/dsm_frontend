import React, { Component } from "react";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

export default class Company extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.updateCompany = this.updateCompany.bind(this);
    this.deleteCompany = this.deleteCompany.bind(this);
    this.renameKey = this.renameKey.bind(this);

    this.state = {
      currentCompany: {
        id: null,
        name: ""
      },
      message: "",
      companies: []
    };
  }

  componentDidMount() {
    this.getCompany(this.props.match.params.id);
    this.retrieveCompanies();
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

  getCompany(id) {
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

  retrieveCompanies() {
    CompanyDataService.getAll()
      .then(response => {
        console.log(response.data);
          response.data.forEach( obj => this.renameKey( obj, 'name', 'label' ) );
          const updatedJson = JSON.stringify( response.data );

          console.log( updatedJson );
        this.setState({
          companies: response.data
        });
        
      })
      .catch(e => {
        console.log(e);
      });
  }

  renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
  }

  updateCompany() {
    CompanyDataService.update(
      this.state.currentCompany.id,
      this.state.currentCompany
    )
      .then(response => {
        console.log(response.data);
        this.props.history.push('/companies')
      })
      .catch(e => {
        console.log(e);
      });
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
    const { currentCompany, companies } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12">
          {currentCompany ? (
            <div className="edit-form">
              <h4>Empresa</h4>
                  <Select options={companies} />
              <form>
                <div className="form-group row">
                  <label htmlFor="name" className="col-sm-1 col-form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control col-sm-6"
                    id="name"
                    value={currentCompany.name}
                    onChange={this.onChangeName}
                  />
                </div>
              </form>          

              <div>

                <Link to={"/companies"} className="btn btn-outline-info btn-sm mr-1">
                  <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
                </Link>

                <button
                  type="submit"
                  className="btn btn-info btn-sm mr-1"
                  onClick={this.updateCompany}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2"/>Guardar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={this.deleteCompany}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2"/>Eliminar
                </button>
              </div>

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