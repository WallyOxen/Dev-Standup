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
  addDev(name) {
    return standupAPI.post("/devs", { name });
  },
  getAllDevs() {
    return standupAPI.get("/devs");
  },
  getActiveDevs() {
    return standupAPI.get("/devs/active");
  },
  devLeft(id) {
    return standupAPI.patch("/devs/left", { id });
  },
  devJoined(id) {
    return standupAPI.patch("/devs/joined", { id });
  },
  getPreviousNotes() {
    return standupAPI.get("/notes");
  },
  saveNotes(data) {
    return standupAPI.post("/notes", data);
  },
};
