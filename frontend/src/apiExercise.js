import axios from "axios";
import config from "./config";

const baseURL = config.apiUrl;

const api = axios.create({
  baseURL,
});

export const trackExercise = (payload) => api.post(`/exercises/add`, payload);

export const getAllExercises = () => api.get("/exercises");

export const getAllExercisesByUser = (username) =>
  api.get(`/exercises/${username}`);
