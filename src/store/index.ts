import { store } from 'quasar/wrappers'
import Vuex from 'vuex'
import roles from './roles'
import central from './central'
import VuexPersist from 'vuex-persist'

export interface StoreInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown;
}

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // @ts-ignore
  reducer: (state) => ({ roles: state.roles })
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default store(function ({ Vue }) {
  Vue.use(Vuex)

  const Store = new Vuex.Store<StoreInterface>({
    modules: {
      roles,
      central
      // user,
      // auth
    },
    plugins: [vuexLocalStorage.plugin],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  })

  return Store
})
