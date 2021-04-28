/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_EMPTY_ROUTERS: (state) => {
      state.addRouters = []
      state.routers = constantRouterMap
    }
  },
  actions: {
    GenerateRoutes ({ commit }, username) {
      return new Promise(resolve => {
        generatorDynamicRouter(username).then(routers => {
          commit('SET_ROUTERS', routers)
          resolve(routers)
        })
      })
    },
    RemoveRouters ({ commit }) {
      return new Promise(resolve => {
        commit('SET_EMPTY_ROUTERS')
        resolve()
      })
    }
  }
}

export default permission
