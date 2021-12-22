import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    redirect: '/login',
    children: [
      {
        path: '/login',
        name: 'login',
        meta: { index: 10 },
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
      },
      {
        path: '/chat-room',
        name: 'chat-room',
        meta: { index: 20 },
        component: () => import(/* webpackChunkName: "chat" */ '../views/ChatRoom.vue')
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
