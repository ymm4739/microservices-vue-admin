
const loading = {
  state: {
    loading: false
  },
  // 使用store.commit()来调用
  mutations: {
    SET_LOADING (state, loading) {
      state.loading = loading
    }
  },
  // 可以用store.dispatch来调用
  actions: {
    SetLoading ({ commit }, loading) {
      return new Promise(resolve => {
          commit('SET_LOADING', loading)
          resolve()
      })
    }
  }
}
export default loading
