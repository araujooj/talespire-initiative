import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://talespire-initiative.herokuapp.com',
});
