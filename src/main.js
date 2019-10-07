import Vue from 'vue'
import App from './App.vue'
import router from './router/router';
import store from './store/store';
import Element, { Message } from 'element-ui';
import axios from './Utils/axios';
import Plugin from './Utils/plugin';
import './assets/css/element-variables.scss';
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
Vue.use(Element);
Vue.use(Plugin);
Vue.use(VueQuillEditor);
Vue.prototype.$http = axios;

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('userInfo') || JSON.stringify(store.getters.userInfo) === '{}') {
    if (to.name == 'login') {
      next();
    } else {
      Message.error("登录过期");
      router.replace('/');
    }
  } else {
    let module = to.path.split('/')[1] ? to.path.split('/')[1] : 'index';
    store.commit('ACTIVE_NAV', module);
    next();
  }
});
console.log(process.env);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
