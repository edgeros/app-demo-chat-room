import { IStoreState } from '../interfaces/store.interface';
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const state: IStoreState = {
  token: '',
  srand: '',
  accountInfo: { // 当前登录用户信息
    acoid: '',
    nickname: '',
    profile: ''
  }
};

export default new Vuex.Store({
  state,
  mutations: {
    update(state, data) {
      Object.keys(data).forEach((key: string) => {
        (state as any)[key] = data[key];
      })
    }
  }
});

