import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_BACKEND + '/api'

class LocationDataService {

  getCountries() {
    return axios.get(API_URL + "/countries", { headers: authHeader() });
  }

  getProvinces(id) {
    return axios.get(API_URL + `/countries/${id}/provinces`, { headers: authHeader() });
  }

  getCities(id) {
    return axios.get(API_URL + `/provinces/${id}/cities`, { headers: authHeader() });
  }

  getCountry(id) {
    return axios.get(API_URL + `/countries/${id}`, { headers: authHeader() });
  }

  getProvince(id) {
    return axios.get(API_URL + `/provinces/${id}/`, { headers: authHeader() });
  }

  getCity(id) {
    return axios.get(API_URL + `/cities/${id}`, { headers: authHeader() });
  }

}

export default new LocationDataService();
