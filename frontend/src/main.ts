import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './views/Home.vue';
import UserList from './views/UserList.vue';
import User from './views/User.vue';
import ChatList from './views/ChatList.vue';
import Chat from './views/Chat.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', components: { default: Home } },
  { path: '/users', components: { default: UserList, Footer, Header } },
  { path: '/users/:userId', components: { default: User, Footer, Header } },
  { path: '/chats', components: { default: ChatList, Footer, Header } },
  { path: '/chats/:chatId', components: { default: Chat, Header } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
