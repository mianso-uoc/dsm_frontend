import React, { Component } from "react";
import IssueDataService from "../services/issue.service";
import CompanyDataService from "../services/company.service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUndo, faPlus, faPlug } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip';

export default class Company extends Component {
  constructor(props) {
    super(props);
    this.getIssue = this.getIssue.bind(this);
    this.getMachines = this.getMachines.bind(this);
    this.addMachine = this.addMachine.bind(this);
    this.removeMachine = this.removeMachine.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      currentIssue: null,
      machines: [],
      estado: "",
      message: ""
    };
  }

  componentDidMount() {
    this.getIssue(this.props.match.params.id);
  }

  refreshList() {
    this.getIssue(this.props.match.params.id);
  }

  addMachine(id) {
    IssueDataService.addMachine(this.state.currentIssue.id, id)
      .then(response => {
        console.log(response.data);
        this.refreshList();
    })
      .catch(e => {
        console.log(e);
      });
    }

  removeMachine(id) {
    IssueDataService.removeMachine(this.state.currentIssue.id, id)
      .then(response => {
        console.log(response.data);
        this.refreshList();
    })
      .catch(e => {
        console.log(e);
      });
    }

  getIssue(id) {
    IssueDataService.get(id)
      .then(response => {
        this.setState({
          currentIssue: response.data
        });
        this.getMachines(response.data.company.id);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getMachines(id) {
    CompanyDataService.getMachines(id)
      .then(response => {
        var list = response.data;
        console.log(list);
        console.log(this.state.currentIssue.machines);
        this.state.currentIssue.machines.map((item) => {
          const index = list.findIndex(machine => machine.id === item.id);
          console.log(index);
          if (index !== -1) {
            list.splice(index, 1);
          }
        }
        );


        this.setState({
          machines: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentIssue, machines } = this.state;

    return (
      <div className="row">
        {currentIssue &&
          <div className="col-md-12">
            <h2 className="">{currentIssue.title} - #{currentIssue.id}
              <span className={"badge badge-" + currentIssue.status + " ml-2"}></span>
            </h2>
            <hr/>

            <h4>Máquinas de {currentIssue.company.name} sin asignar</h4>
            <p>Las siguientes máquinas pueden añadirse a la incidencia</p>

            {machines.length > 0 &&
              <table className="table table-striped table-bordered table-hover">
                <thead className="table-info">
                  <tr>
                    <th className="width20">Id</th>
                    <th className="width60">Producto</th>
                    <th className="width60">Nº serie</th>
                    <th className="width20">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {machines &&
                  machines.map((machine, index) => (
                    <tr key={index}>
                      <td>{machine.id}</td>
                      <td>{machine.product && machine.product.name}</td>
                      <td>{machine.serialNumber}</td>
                      <td>
                        <a
                          className="text-info"
                          data-tip="Añadir"
                          onClick={() => {this.addMachine(machine.id)}}
                        >
                          <ReactTooltip />
                          <FontAwesomeIcon icon={faPlus} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
            {machines.length == 0 &&
              <div className="alert alert-warning">No hay máquinas</div>
            }

            <div>
              <h4 className="mt-5">Máquinas de la incidencia<FontAwesomeIcon icon={faPlug} className="ml-2 text-info"/></h4>
              {currentIssue.machines && currentIssue.machines.length > 0 &&
                <table className="table table-striped table-bordered table-hover">
                  <thead className="table-info">
                    <tr>
                      <th className="width20">Id</th>
                      <th className="width60">Producto</th>
                      <th className="width60">Nº serie</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentIssue.machines.map((machine, index) => (
                      <tr key={index}>
                        <td>{machine.id}</td>
                        <td>{machine.product.name}</td>
                        <td>{machine.serialNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
              {currentIssue.machines.length == 0 &&
                <div className="alert alert-warning">No hay máquinas asignadas aún</div>
              }
            </div>

            <Link to={"/issues/" + currentIssue.id + "/view"} className="btn btn-outline-info btn-sm mr-1">
              <FontAwesomeIcon icon={faUndo} className="mr-2"/>Volver
            </Link>
          </div>}
        </div>
      );
  }
}
