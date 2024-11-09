import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { auth } from './firebase';
import router from './router'

loadFonts();

router.beforeEach((to, from, next) => {
    if (to.name === 'TictactoeView' && !auth.currentUser) {
      next({ name: 'LoginView' });
    } else {
      next();
    }
  });

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app')
