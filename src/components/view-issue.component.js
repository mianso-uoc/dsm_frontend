import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import DocumentDataService from "../services/document.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faUndo, faPlus, faComment, faPlug, faDownload, faFile } from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import DataTable from 'react-data-table-component';
import ReactTooltip from 'react-tooltip';

export default class Issue extends Component {
  constructor(props) {
    super(props);
    this.getIssue = this.getIssue.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
    this.deleteMachine = this.deleteMachine.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = {
      currentIssue: {
        id: null,
        name: ""
      },
      message: "",
      documents: "",
      estado: "",
      showModal: false,
      currentDocument: null
    };
  }

  handleShow(doc) {
    this.setState({
      showModal: true,
      currentDocument: doc
    });
  }

  handleClose() {
    this.setState({
      showModal: false
    });
  }

  componentDidMount() {
    this.getIssue(this.props.match.params.id);
    this.getDocuments(this.props.match.params.id);
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

  deleteMachine(id) {
    IssueDataService.deleteMachine(id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/issues/' + this.state.currentIssue.id + "/view")
        this.refreshList()
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.getMachines(this.props.match.params.id);
  }

  download(arrayBuffer) {
    var type = "application/pdf";
    var blob = new Blob([arrayBuffer], { type: type });
    var url = URL.createObjectURL(blob);
    window.open(url);
  }

  render() {
    const { currentIssue, documents, estado, showModal, currentDocument } = this.state;

    return (
      <div className="row mb-3">
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
          <div className="row mb-2">
            <div className="col-md-2"><strong>Fecha de cierre</strong></div>
            <div className="col-md-10">{new Date(currentIssue.closeDate).toLocaleDateString()}</div>
          </div>
          {currentIssue.technician && <div className="row mb-2">
            <div className="col-md-2"><strong>Técnico asignado</strong></div>
            <div className="col-md-10">{currentIssue.technician.name}</div>
          </div>}
          <div className="row mb-2">
            <div className="col-md-2"><strong>Solución</strong></div>
            <div className="col-md-10">{currentIssue.solution}</div>
          </div>
          <div className="row">
            <div className="col-md-2"><strong>Precio total</strong></div>
            <div className="col-md-10">{currentIssue.totalPrice} €</div>
          </div>
          {currentIssue.status=="PENDING" && <div>
            <Link to={"/issues/" + currentIssue.id + "/addMachine"} className="btn btn-info float-right">
              <FontAwesomeIcon icon={faPlus} className="mr-2"/>
              Nueva máquina
            </Link>
          </div>}

          <h5 className="mt-5">Máquinas<FontAwesomeIcon icon={faPlug} className="ml-2 text-info"/></h5>

          {currentIssue.machines && currentIssue.machines.length > 0 &&
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
          }

          <h5 className="mt-4">Documentos<FontAwesomeIcon icon={faFile} className="ml-2 text-info"/></h5>

          <div className="row">
            {documents && documents.length > 0 && documents.map((document, index) => (

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
                        onClick={() => {this.download(document.file)}}
                      >
                        <ReactTooltip />
                        <FontAwesomeIcon icon={faTrash} />
                      </a>
                      <a
                        className="text-info float-right mr-2"
                        data-tip="Descargar"
                        onClick={() => {this.download(document.file)}}
                      >
                        <ReactTooltip />
                        <FontAwesomeIcon icon={faDownload} />
                      </a>
                    </div>
                  </div>
                </div>
            ))
            }
            <Modal size="xl" show={showModal} onHide={() => {this.handleClose()}}>
              <Modal.Header closeButton>
              </Modal.Header>
              {currentDocument && <Modal.Body><img style={{width: '100%'}} src={"data:" + currentDocument.mimetype + ";base64," + currentDocument.file} class="card-img-top" alt={currentDocument.fileName} /></Modal.Body>}
              <Modal.Footer><div id="modalFooter"></div></Modal.Footer>
            </Modal>
          </div>

          <h5 className="mt-2">Comentarios<FontAwesomeIcon icon={faComment} className="ml-2 text-info"/></h5>

          <ul class="list-group">
            {currentIssue.comments && currentIssue.comments.length > 0 && currentIssue.comments.map((comment, index) => (
                  <li class="list-group-item">
                    <div className="row">
                      <div className="col-md-2">{comment.user.name}</div>
                      <div className="col-md-10">{comment.text}</div>
                    </div>
                  </li>
                ))
            }
            <li class="list-group-item">
              <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-10">
                  <textarea type="text" rows="4" class="form-control" placeholder="Escribe tu comentario..."/>
                  <button className="btn btn-primary pull-right mt-2">Añadir</button>
                </div>
              </div>
            </li>
          </ul>


          <Link to={"/issues"} className="btn btn-outline-info btn-sm mr-1 mt-4">
            <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
          </Link>
        </div>
      </div>
    );
  }
}
