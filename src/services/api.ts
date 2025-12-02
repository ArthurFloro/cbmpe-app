import axios from "axios";

const BASE_URL = "http://192.168.1.2:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
