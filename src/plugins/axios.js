import standupAPI from "@/assets/js/api.js";

export default {
  install(Vue) {
    if (Vue.prototype.$api) {
      throw new Error("$api already exists on the Vue prototype!");
    }
    Vue.prototype.$api = standupAPI;
  },
};
