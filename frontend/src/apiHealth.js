import axios from 'axios';
import config from './config';

const baseURL = config.apiUrl

const api = axios.create({
    baseURL
});

export const trackHealth = payload => api.post(`/health/add`, payload);