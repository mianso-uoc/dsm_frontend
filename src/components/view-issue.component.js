import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import DocumentDataService from "../services/document.service";
import CommentDataService from "../services/comment.service";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo, faPlus, faComment, faPlug, faDownload, faFile } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import ReactTooltip from 'react-tooltip';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
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

export default class Issue extends Component {
  constructor(props) {
    super(props);
    this.getIssue = this.getIssue.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCloseClose = this.handleCloseClose.bind(this);
    this.handleShowClose = this.handleShowClose.bind(this);
    this.handleCloseSolve = this.handleCloseSolve.bind(this);
    this.handleShowSolve = this.handleShowSolve.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.solveIssue = this.solveIssue.bind(this);
    this.onChangeSolution = this.onChangeSolution.bind(this);
    this.onChangeTotalPrice = this.onChangeTotalPrice.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.publishComment = this.publishComment.bind(this);
    this.onChangeCommentText = this.onChangeCommentText.bind(this);

    this.state = {
      currentIssue: {
        id: null,
        name: ""
      },
      commentText: "",
      message: "",
      messageComment: "",
      loading: false,
      documents: "",
      estado: "",
      showModalDoc: false,
      showModalClose: false,
      showModalSolve: false,
      currentDocument: null
    };
  }

  handleShow(doc) {
    this.setState({
      showModalDoc: true,
      currentDocument: doc
    });
  }

  handleClose() {
    this.setState({
      showModalDoc: false
    });
  }

  handleShowClose() {
    this.setState({
      showModalClose: true
    });
  }

  handleCloseClose() {
    this.setState({
      showModalClose: false
    });
  }

  handleShowSolve() {
    this.setState({
      showModalSolve: true
    });
  }

  handleCloseSolve() {
    this.setState({
      showModalSolve: false
    });
  }

  componentDidMount() {
    this.getIssue(this.props.match.params.id);
    this.getDocuments(this.props.match.params.id);

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

  getDocuments(id) {
    DocumentDataService.getByIssue(id)
      .then(response => {
        this.setState({
          documents: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  closeIssue(id) {
    IssueDataService.close(this.state.currentIssue)
      .then(response => {
        this.setState({
          message: "Se ha cerrado la incidencia"
        });
        this.getIssue(this.state.currentIssue.id);
      })
      .catch(e => {
        console.log(e);
      });
  }

  solveIssue(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      IssueDataService.solve(this.state.currentIssue)
        .then(response => {
          this.setState({
            message: "Se ha resuelto la incidencia"
          });
          this.getIssue(this.state.currentIssue.id);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  onChangeSolution(e) {
    const solution = e.target.value;

    this.setState(function(prevState) {
      return {
        currentIssue: {
          ...prevState.currentIssue,
          solution: solution
        }
      };
    });
  }

  onChangeCommentText(e) {
    this.setState({
      commentText: e.target.value
    });
  }

  onChangeTotalPrice(e) {
    const totalPrice = e.target.value;

    this.setState(function(prevState) {
      return {
        currentIssue: {
          ...prevState.currentIssue,
          totalPrice: totalPrice
        }
      };
    });
  }

  refreshList() {
    this.getDocuments(this.props.match.params.id);
  }

  download(mimetype, file, name) {
    var a = document.createElement("a"); //Create <a>
    a.href = "data:' + mimetype + ';base64," + file;
    a.download = name;
    a.click();
  }

  deleteDocument(id) {
    DocumentDataService.delete(id)
      .then(response => {
        console.log(response.data);
        this.refreshList()
      })
      .catch(e => {
        console.log(e);
      });
  }

  publishComment(e) {
    e.preventDefault();

    this.setState({
      messageComment: "",
      loading: true
    });

    var data = {
      text: this.state.commentText,
      user: this.state.currentUser
    };


    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      CommentDataService.create(this.state.currentIssue.id, data)
        .then(response => {
          this.setState({
            commentText: " ",
            loading: false
          });
          this.getIssue(this.props.match.params.id);
        })
        .catch(e => {
          console.log(e);
          this.setState({
            loading: false,
            messageComment: 'Se ha producido un error'
          });
        });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    const { currentUser, currentIssue, documents, estado, showModalDoc, showModalClose, showModalSolve, currentDocument, message } = this.state;

    return (
      <div className="row mb-3">
        {message && <div className="alert alert-success alert-dismissible col-md-12">
          {message}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div>}
        <div className="col-md-12">
          <h2 className="">{currentIssue.title} - #{currentIssue.id}
            <span className={"badge badge-" + currentIssue.status + " ml-2"}>{estado}</span>
          </h2>
          <hr/>
          <div className="row mb-2">
            <div className="col-md-2"><strong>Descripción</strong></div>
            <div className="col-md-10">{currentIssue.description}</div>
          </div>
          {currentIssue.company && <div className="row mb-2">
            <div className="col-md-2"><strong>Empresa</strong></div>
            <div className="col-md-10">{currentIssue.company.name}</div>
          </div>}
          <div className="row mb-2">
            <div className="col-md-2"><strong>Fecha de creación</strong></div>
            <div className="col-md-10">{new Date(currentIssue.createDate).toLocaleDateString()}</div>
          </div>
          {currentIssue.closeDate && <div className="row mb-2">
            <div className="col-md-2"><strong>Fecha de cierre</strong></div>
            <div className="col-md-10">{new Date(currentIssue.closeDate).toLocaleDateString()}</div>
          </div>}
          {currentIssue.technician && <div className="row mb-2">
            <div className="col-md-2"><strong>Técnico asignado</strong></div>
            <div className="col-md-10">{currentIssue.technician.name}</div>
          </div>}
          {currentIssue.status == "SOLVED" && <div className="row mb-2">
            <div className="col-md-2"><strong>Solución</strong></div>
            <div className="col-md-10 preservar">{currentIssue.solution}</div>
          </div>}
          {currentIssue.status == "SOLVED" && <div className="row">
            <div className="col-md-2"><strong>Precio total</strong></div>
            <div className="col-md-10">{currentIssue.totalPrice} €</div>
          </div>}




          {currentIssue.machines && currentIssue.machines.length > 0 &&
            <div>
              <h5 className="mt-5">Máquinas<FontAwesomeIcon icon={faPlug} className="ml-2 text-info"/></h5>
              <table className="table table-striped table-bordered table-hover">
                <thead className="table-info">
                  <tr>
                    <th className="width20">Id</th>
                    <th className="width60">Producto</th>
                    <th className="width60">Nº serie</th>
                    {currentIssue.status=="PENDING" && <th className="width20">Acciones</th>}
                  </tr>
                </thead>

                <tbody>
                  {currentIssue.machines.map((machine, index) => (
                    <tr key={index}>
                      <td>{machine.id}</td>
                      <td>{machine.product.name}</td>
                      <td>{machine.serialNumber}</td>
                      {currentIssue.status=="PENDING" && <td>
                        <a
                          className="text-danger"
                          data-tip="Eliminar"
                          onClick={() => {this.deleteMachine(machine.id)}}
                        >
                          <ReactTooltip />
                          <FontAwesomeIcon icon={faTrash} />
                        </a>
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }

          {documents && documents.length > 0 && <div>
            <h5 className="mt-4">Documentos<FontAwesomeIcon icon={faFile} className="ml-2 text-info"/></h5>

            <div className="row">
              {documents.map((document, index) => (

                <div className="col-3">
                  <div className="card">

                    {document.mimetype.startsWith("image") &&
                      <div className="card-image" onClick={() => {this.handleShow(document)}}>
                        <img style={{width: '100%'}} src={"data:" + document.mimetype + ";base64," + document.file} class="card-img-top" alt={document.fileName} />
                      </div>
                    }
                    {!document.mimetype.startsWith("image") &&
                      <div className="card-document">
                        <h1><FontAwesomeIcon icon={faFile} className="ml-2 text-info"/></h1>
                      </div>
                    }
                    <div class="card-body card-file">
                      <div>{document.technician.name}</div>
                      <div>{document.fileName}</div>

                      <a
                        className="text-danger float-right"
                        data-tip="Eliminar"
                        onClick={() => {this.deleteDocument(document.id)}}
                      >
                        <ReactTooltip />
                        <FontAwesomeIcon icon={faTrash} />
                      </a>
                      <a
                        className="text-info float-right mr-2"
                        data-tip="Descargar"
                        onClick={() => {this.download(document.mimetype, document.file, document.fileName)}}
                      >
                        <ReactTooltip />
                        <FontAwesomeIcon icon={faDownload} />
                      </a>
                    </div>
                  </div>
                </div>
              )) }
              <Modal size="xl" show={showModalDoc} onHide={() => {this.handleClose()}}>
                <Modal.Header closeButton>
                  {currentDocument &&
                    <span>{currentDocument.fileName}<span class="font-weight-light"> - Subido por {currentDocument.technician.name}</span></span>
                  }
                </Modal.Header>
                {currentDocument && <Modal.Body><img style={{width: '100%'}} src={"data:" + currentDocument.mimetype + ";base64," + currentDocument.file} class="card-img-top" alt={currentDocument.fileName} /></Modal.Body>}

              </Modal>
            </div>
          </div>}

          {((currentIssue.comments && currentIssue.comments.length > 0) || currentIssue.status == 'PENDING') && <h5 className="mt-2">Comentarios<FontAwesomeIcon icon={faComment} className="ml-2 text-info"/></h5>}

          <ul class="list-group">
            {currentIssue.comments && currentIssue.comments.length > 0 && currentIssue.comments.map((comment, index) => (
                  <li class="list-group-item">
                    <div className="row">
                      <div className="col-md-2"><span className={"badge badge-" + comment.user.type}>{comment.user.name}</span></div>
                      <div className="col-md-10 preservar">{comment.text}</div>
                    </div>
                  </li>
                ))
            }
            {currentIssue.status == "PENDING" && <li class="list-group-item">
              <div className="row">
                <div className="col-md-10 offset-md-2">
                  <Form
                    onSubmit={this.publishComment}
                    ref={c => {
                      this.form = c;
                    }}
                  >

                    <div className="form-group mt-2">
                      <Textarea
                        type="text"
                        className="form-control col-sm-12"
                        name="commentText"
                        rows="4"
                        value={this.state.commentText}
                        placeholder="Escribe tu comentario..."
                        onChange={this.onChangeCommentText}
                        validations={[required]}
                      />
                    </div>

                    <button
                      className="btn btn-primary pull-right btn-sm mt-2"
                      disabled={this.state.loading}
                    >
                      {this.state.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <FontAwesomeIcon icon={faPlus} className="mr-2"/>Añadir comentario
                    </button>

                    {this.state.messageComment && (
                      <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                          {this.state.messageComment}
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
            </li>}
          </ul>


          {currentUser && currentUser.type =="Customer" && <Link to={"/home"} className="btn btn-outline-info btn-sm mr-1 mt-4">
            <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
          </Link>}

          {currentUser && currentUser.type =="Technician" && currentIssue.status != "PENDING" &&
              <Link to={"/issues"} className="btn btn-outline-info btn-sm mr-1 mt-4">
                <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
              </Link>
            }

          {currentUser && currentUser.type =="Technician" && currentIssue.status == "PENDING" &&
            <div>
              <Link to={"/issues"} className="btn btn-outline-info btn-sm mr-1 mt-4">
                <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
              </Link>

              <Link to={"/issues/" + currentIssue.id} className="btn btn-info btn-sm mr-1 mt-4">
                <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                Editar
              </Link>

              <a className="btn btn-danger btn-sm mr-1 mt-4"  data-place="bottom" data-tip="Cierra la incidencia en caso de que no pueda resolverse" onClick={() => {this.handleShowClose()}}>
                <FontAwesomeIcon icon={faUndo} className="mr-2"/>Cerrar incidencia
                <ReactTooltip />
              </a>

              {currentIssue.machines && currentIssue.machines.length > 0 && <a className="btn btn-success btn-sm mr-1 mt-4"  data-place="bottom" data-tip="Resuelve la incidencia indicando la solución dada" onClick={() => {this.handleShowSolve()}}>
                <FontAwesomeIcon icon={faUndo} className="mr-2"/>Resolver incidencia
                <ReactTooltip />
              </a>}

              <Link to={"/issues/" + currentIssue.id + "/machines"} className="btn btn-info btn-sm mr-1 mt-4">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Añadir máquina
              </Link>

              <Link to={"/issues/" + currentIssue.id + "/addDocument"} className="btn btn-info btn-sm mt-4">
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                Añadir documento
              </Link>

              <Modal show={showModalClose} onHide={() => {this.handleCloseClose()}}>
                <Modal.Header closeButton>
                  Cerrar incidencia
                </Modal.Header>
                <Modal.Body>
                  ¿Esta seguro de que quiere cerrar la incidencia?
                </Modal.Body>

                <Modal.Footer>
                  <a className="btn btn-danger" onClick={() => {this.closeIssue()}}>
                    Sí
                  </a>
                </Modal.Footer>
              </Modal>

              <Modal show={showModalSolve} onHide={() => {this.handleCloseSolve()}}>
                <Modal.Header closeButton>
                  Resolver incidencia
                </Modal.Header>
                <Modal.Body>
                  Indique los siguientes datos para resolver la incidencia:
                  <Form
                    onSubmit={this.solveIssue}
                    ref={c => {
                      this.form = c;
                    }}
                  >

                    <div className="form-group mt-2">
                      <label htmlFor="name">Solución</label>
                      <Textarea
                        type="text"
                        className="form-control col-sm-12"
                        name="name"
                        cols="5"
                        value={this.state.solution}
                        onChange={this.onChangeSolution}
                        validations={[required]}
                      />
                    </div>

                    <div className="form-group mt-2">
                      <label htmlFor="name">Precio total</label>
                      <Input
                        type="text"
                        className="form-control col-sm-12"
                        name="name"
                        value={this.state.totalPrice}
                        onChange={this.onChangeTotalPrice}
                        validations={[required]}
                      />
                    </div>

                    <button
                      className="btn btn-info btn-sm mr-1"
                      disabled={this.state.loading}
                    >
                      {this.state.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <FontAwesomeIcon icon={faEdit} className="mr-2"/>Resolver
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
                </Modal.Body>
              </Modal>
          </div>
          }

        </div>
      </div>
    );
  }
}
