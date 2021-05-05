import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_BACKEND + '/api'

class CommentDataService {

  get(id) {
    return axios.get(API_URL + `/comments/${id}`, { headers: authHeader() });
  }

  create(id, data) {
    return axios.post(API_URL + `/issues/${id}/comments`, data, { headers: authHeader() });
  }

}

export default new CommentDataService();
