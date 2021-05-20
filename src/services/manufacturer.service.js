import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_BACKEND + '/api'

class ManufacturerDataService {

  getAll() {
    return axios.get(API_URL + "/manufacturers", { headers: authHeader() });
  }

  get(id) {
    return axios.get(API_URL + `/manufacturers/${id}`, { headers: authHeader() });
  }

  getByProduct(id) {
    return axios.get(API_URL + `/manufacturers/products/${id}`, { headers: authHeader() });
  }

  create(data) {
    return axios.post(API_URL + "/manufacturers", data, { headers: authHeader() });
  }

  update(id, data) {
    return axios.put(API_URL + `/manufacturers/${id}`, data, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(API_URL + `/manufacturers/${id}`, { headers: authHeader() });
  }

  getProducts(id) {
    return axios.get(API_URL + `/manufacturers/${id}/products`, { headers: authHeader() });
  }

  getProduct(id) {
    return axios.get(API_URL + `/products/${id}`, { headers: authHeader() });
  }

  createProduct(data) {
    return axios.post(API_URL + "/products", data, { headers: authHeader() });
  }

  updateProduct(id, data) {
    return axios.put(API_URL + `/products/${id}`, data, { headers: authHeader() });
  }

  deleteProduct(id) {
    return axios.delete(API_URL + `/products/${id}`, { headers: authHeader() });
  }

}

export default new ManufacturerDataService();
