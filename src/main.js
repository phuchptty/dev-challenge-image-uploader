import { createApp } from 'vue'
import App from './App.vue'

import './index.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";
import firebaseConfig from './firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);

getStorage(firebaseApp);

const app = createApp(App)

app.use(VueSweetalert2);

app.mount('#app');