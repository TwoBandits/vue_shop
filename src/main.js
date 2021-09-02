import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

import './plugins/element.js';
import './assets/style/base.css';
import './assets/style/fonts/iconfont.css';

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios请求拦截器
axios.interceptors.request.use( config => {
  // 访问授权API时，在请求头中携带token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
