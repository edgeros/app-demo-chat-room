import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';
import 'vant/lib/index.less';
import { edger } from '@edgeros/web-sdk';

Vue.config.productionTip = false;

Vue.prototype.$edger = edger;

edger.avoidKeyboardOverlay();
edger.token().then((data) => {
  if (data) {
    store.commit('update', { token: data.token, srand: data.srand });
  }
});

edger.onAction('token', (data) => {
  if (data) {
    store.commit('update', { token: data.token, srand: data.srand });
  }
});

edger
  .user()
  .then((result) => {
    if (result && result.acoid) {
      store.commit('update', { accountInfo: result });
    } else {
      edger.notify.error('当前登录信息出错，请检查重启！');
    }
  })
  .catch((error: Error) => {
    edger.notify.error('请先登录爱智账号！');
    throw error;
  })
  .finally(() => {
    new Vue({
      router,
      store,
      render: (h) => h(App)
    }).$mount('#app');
  });
