import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from './modules/fbfile/firebase'; // Import the initialized auth

import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is authenticated", user);
    } else {
        console.warn("User is not authenticated");
    }
});

const app = createApp(App);
app.use(router);
app.mount('#app');