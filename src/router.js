import Vue from 'vue';
import Router from 'vue-router';

import Login from './components/Login';
import Home from './components/Home';
import Welcome from './components/Welcome';
import Users from './components/User';
import Power from './components/Power';
import Roles from './components/Power/Roles'

Vue.use(Router);

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect:'/welcome',
            children:[
                {path:'/welcome',component:Welcome},
                {path:'/users',component:Users},
                {path:'/rights',component:Power},
                {path:'/roles',component:Roles}
            ]
        }
    ]
});

// 通过路由守卫控制访问权限
router.beforeEach((to, from, next) => {
    if (to.path === '/login') next();

    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');

    next();
})

export default router;