import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
// 导入富文本编辑器的插件
import VueQuillEditor from 'vue-quill-editor';
import NProgress from 'nprogress';

// elementUI的样式
import './plugins/element.js';
import './assets/style/base.css';
import './assets/style/fonts/iconfont.css';
// 富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// nprogress对应样式
import 'nprogress/nprogress.css'

Vue.config.productionTip = false;

// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.defaults.baseURL = 'http://121.199.13.241:8889/api/private/v1/';

// 隐藏 Nprogress 右上角的loading
NProgress.configure({
  showSpinner: false
})

// axios请求拦截器
axios.interceptors.request.use(config => {
  // 在页面展示进度条
  NProgress.start()
  // 访问授权API时，在请求头中携带token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// axios响应拦截器
axios.interceptors.response.use(config => {
  // 在请求响应前关闭进度条
  NProgress.done()
  return config
})
Vue.prototype.$http = axios;

// 全局过滤器，格式化商品列表中的时间
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // String.prototype.padStart() 用一个字符串填充另一个字符串，使其达到指定长度
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 注册全局组件 tree-table
Vue.component('tree-table', TreeTable);
Vue.use(VueQuillEditor);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');