import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_BACKEND + '/api'

class UserDataService {

  getAll() {
    return axios.get(API_URL + "/users", { headers: authHeader() });
  }

  getAllByType(type) {
    return axios.get(API_URL + `/users/type/${type}`, { headers: authHeader() });
  }

  get(id) {
    return axios.get(API_URL + `/users/${id}`, { headers: authHeader() });
  }

  create(data, companyId) {
    return axios.post(API_URL + `/users?companyId=${companyId}`, data, { headers: authHeader() });
  }

  update(id, data, companyId) {
    if (companyId == undefined) {
      return axios.put(API_URL + `/users/${id}`, data, { headers: authHeader() });
    } else {
      return axios.put(API_URL + `/users/${id}?companyId=${companyId}`, data, { headers: authHeader() });
    }
  }

  delete(id) {
    return axios.delete(API_URL + `/users/${id}`, { headers: authHeader() });
  }

}

export default new UserDataService();
