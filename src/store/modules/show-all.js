import Vue from 'vue'
import Vuex from 'vuex'
import {APP_NAME,TARGET_ID} from '@/store/mutation-types'
import storage from 'store'
// import state from './state'
// import mutations from './mutation'
Vue.use(Vuex);
// export default new Vuex.Store({
//     //namespaced:true,
//     state:{
//         appName:''
//     },
//     // getters:{
//     //     getAppName(state){
//     //         return state.appName;
//     //     }
//     // },
//     mutations:{
//         changeAppName(state,value){
//             state.appName = value;
//         }
//     }
// })

const showAll = {
    state:{
        appName:'',
        targetId:''
    },
    mutations: {
        [APP_NAME]: (state, value) => {
          state.appName = value
          storage.set(APP_NAME, value)
        },
        [TARGET_ID]: (state, value) => {
            state.targetId = value
            storage.set(TARGET_ID, value)
          }
    }
}

export default showAll;