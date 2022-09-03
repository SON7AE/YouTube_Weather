// import Vue from "vue";
import { createApp } from 'vue';
import App from './App';
import router from './routes/index.js';
import store from './store/index.js';

createApp(App).use(router).use(store).mount('#app');
