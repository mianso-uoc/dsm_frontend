import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_BACKEND + '/api'

class DocumentDataService {

  getByIssue(id) {
    return axios.get(API_URL + `/issues/${id}/documents`, { headers: authHeader() });
  }

  get(id) {
    return axios.get(API_URL + `/documents/${id}`, { headers: authHeader() });
  }

  create(id, data) {
    return axios.post(API_URL + `/issues/${id}/documents`, data, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(API_URL + `/documents/${id}`, { headers: authHeader() });
  }

}

export default new DocumentDataService();
