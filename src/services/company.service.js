import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api'

class CompanyDataService {
  
  getAll() {
    return axios.get(API_URL + "/companies", { headers: authHeader() });
  }

  get(id) {
    return axios.get(API_URL + `/companies/${id}`, { headers: authHeader() });
  }

  create(data) {
    return axios.post(API_URL + `/companies`, data, { headers: authHeader() });
  }

  update(id, data) {
    return axios.put(API_URL + `/companies/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(API_URL + `/companies/${id}`, { headers: authHeader() });
  }

  getMachines(id) {
    return axios.get(API_URL + `/companies/${id}/machines`, { headers: authHeader() });
  }

  getMachine(id) {
    return axios.get(API_URL + `/machines/${id}`, { headers: authHeader() });
  }

  createMachine(data) {
    return axios.post(API_URL + `/machines`, data, { headers: authHeader() });
  }

  updateMachine(id, data) {
    return axios.put(API_URL + `/machines/${id}`, data, { headers: authHeader() });
  }

  deleteMachine(id) {
    return axios.delete(API_URL + `/machines/${id}`, { headers: authHeader() });
  }

}

export default new CompanyDataService();