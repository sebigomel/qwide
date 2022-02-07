const axios = require("axios");
const server = axios.create({
  baseURL: "http://localhost:5000/api/",
  timeout: 2000,
  withCredentials: true,
});

export default server;
