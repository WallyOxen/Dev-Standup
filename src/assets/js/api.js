const Axios = require("axios");

const standupAPI = Axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

standupAPI.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  getActiveDevs() {
    return standupAPI.get("/devs");
  },
  getPreviousNotes() {
    return standupAPI.get("/notes");
  },
  saveNotes(data) {
    return standupAPI.post("/notes", data);
  },
};
