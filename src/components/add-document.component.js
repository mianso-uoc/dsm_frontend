import React, { Component } from "react";
import DocumentDataService from "../services/document.service";
import IssueDataService from "../services/issue.service";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
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

export default class AddDocument extends Component {
  constructor(props) {
    super(props);
    this.getIssue = this.getIssue.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.saveDocument = this.saveDocument.bind(this);

    this.state = {
      id: null,
      fileName: "",
      file: null,
      mimetype: null,
      submitted: false,
      currentIssue: null,
      currentUser: null,
      selectedFile: null
    };
  }

  componentDidMount() {
    this.getIssue(this.props.match.params.id);
    const user = AuthService.getCurrentUser();
    UserService.get(user.id)
      .then(response => {
        this.setState({
          currentUser: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  getIssue(id) {
    IssueDataService.get(id)
      .then(response => {
        var estado = "Pendiente";
        if(response.data.status == "SOLVED")
          estado = "Resuelta";
        else if(response.data.status == "CLOSED")
          estado = "Cerrada";
        this.setState({
          currentIssue: response.data,
          estado: estado
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  saveDocument(e) {

    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {

      var data = {
        fileName: this.state.fileName,
        file: this.state.file,
        technician: this.state.currentUser,
        mimetype: this.state.mimetype
      };

      DocumentDataService.create(this.state.currentIssue.id, data)
        .then(response => {
          this.setState({
            id: response.data.id,
            fileName: response.data.fileName,
            file: response.data.file,
            technician: response.data.technician,
            mimetype: response.data.mimetype,

            submitted: true
          });
          console.log(response.data);
          this.props.history.push('/issues/'+ this.props.match.params.id + "/view");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  onChangeName(e) {
    this.setState({
      fileName: e.target.value
    });
  }

  onChangeFile(e) {

    let { file } = this.state;

    file = e.target.files[0];

    this.getBase64(file)
      .then(result => {
        file["base64"] = result;
        var type = result.split(",")[0];
        type = type.substr(type.indexOf(":") + 1, type.indexOf(";") - type.indexOf(":") -1);
        this.setState({
          file: result.split(",")[1],
          mimetype: type,
          fileName: file.name
        });

        console.log(this.state);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        //console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  render() {
    const { currentIssue } = this.state;

    return (
        <div className="row">
          {currentIssue && <div className="col-sm-12">
            <div className="edit-form">
              <h4>Nuevo documento - Incidencia {currentIssue.id}</h4>
              <Form
                onSubmit={this.saveDocument}
                ref={c => {
                  this.form = c;
                }}
              >

                <div className="form-group row">
                  <label htmlFor="file" className="col-sm-1 col-form-label">Fichero</label>
                  <div className="col-sm-6">
                    <Input
                      type="file"
                      className="form-control"
                      id="file"
                      onChange={this.onChangeFile}
                      validations={[required]}
                    />
                  </div>
                </div>

                <Link to={"/issues/" + currentIssue.id + "/view"} className="btn btn-outline-info btn-sm mr-1">
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
        }
      </div>
    );
  }
}
