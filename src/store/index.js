import { createStore } from "vuex";

export default createStore({
  state: {
    loading: false
  },
  getters: {},
  mutations: {
    LOADING(state, payload) {
      state.loading = payload
    }
  },
  actions: {},
  modules: {},
});
