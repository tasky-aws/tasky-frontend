import axios, { AxiosInstance } from 'axios'
import { boot } from 'quasar/wrappers'

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default boot(({ store, Vue }) => {
  Vue.prototype.$axios = axios
  store.$axios = axios
})
