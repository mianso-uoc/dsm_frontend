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

  get(id) {
    return axios.get(API_URL + `/issues/${id}`, { headers: authHeader() });
  }

  create(data) {
    return axios.post(API_URL + `/issues`, data, { headers: authHeader() });
  }

  update(id, data) {
    return axios.put(API_URL + `/issues/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(API_URL + `/issues/${id}`, { headers: authHeader() });
  }

}

export default new IssueDataService();
