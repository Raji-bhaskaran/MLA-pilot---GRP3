import axios from 'axios';

function getUrl() {
    if (process.env.CODESPACES === "true") {
        return `https://${process.env.CODESPACE_NAME}-5301.app.github.dev`;
    } else {
        return `http://localhost:5301`;
    }
}

const baseURL = getUrl();

const api = axios.create({
    baseURL
});

export const trackHealth = payload => api.post(`/health/add`, payload);