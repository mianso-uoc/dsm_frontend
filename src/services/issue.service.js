import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_BACKEND + '/api'

class IssueDataService {

  getAll() {
    return axios.get(API_URL + "/issues", { headers: authHeader() });
  }

  getByTechnician(id) {
    return axios.get(API_URL + `/issues/technician/${id}`, { headers: authHeader() });
  }

  getByCompany(id) {
    return axios.get(API_URL + `/issues/company/${id}`, { headers: authHeader() });
  }

  find(startDate, endDate, companyId) {

    if (companyId == undefined) {
      return axios.get(API_URL + `/issues/${startDate}/${endDate}`, { headers: authHeader() });
    } else {
      return axios.get(API_URL + `/issues/${startDate}/${endDate}/${companyId}`, { headers: authHeader() });
    }
  }

  getByDates(startDate, endDate) {
    return axios.get(API_URL + `/issues/${startDate}/${endDate}`, { headers: authHeader() });
  }

  get(id) {
    return axios.get(API_URL + `/issues/${id}`, { headers: authHeader() });
  }

  create(data) {
    return axios.post(API_URL + `/issues`, data, { headers: authHeader() });
  }

  update(id, data) {
    return axios.put(API_URL + `/issues/${id}`, data, { headers: authHeader() });
  }

  close(data) {
    return axios.put(API_URL + `/issues/${data.id}/close`, data, { headers: authHeader() });
  }

  solve(data) {
    return axios.put(API_URL + `/issues/${data.id}/solve`, data, { headers: authHeader() });
  }

  addMachine(issueId, machineId) {
    return axios.put(API_URL + `/issues/${issueId}/machine/${machineId}`, null, { headers: authHeader() });
  }

  removeMachine(issueId, machineId) {
    return axios.delete(API_URL + `/issues/${issueId}/machine/${machineId}`, null, { headers: authHeader() });
  }

}

export default new IssueDataService();
