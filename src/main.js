import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import './assets/theme/theme-#66cccc/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import 'babel-polyfill'

Vue.use(ElementUI);
Vue.use(VueRouter);

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  // mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  // console.log(router)
  // console.log('菜单',sessionStorage.menu)
  //NProgress.start();
  if (to.path === '/login') {

    if (!!sessionStorage) {
      sessionStorage.user = '';
    }
  }
  let user = '';
  if (!!sessionStorage && !!sessionStorage.userInfo) {
    user = JSON.parse(sessionStorage.userInfo);
  }
  if (!user && to.path !== '/login' && to.path !== '/register' && to.path
      !== '/forgetPwd' && to.path !== '/fgPwdAP') {
    next({path: '/login'})
  } else {
    next()
  }
});

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  //components: { App }
  render: h => h(App)
}).$mount('#app');

