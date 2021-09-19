import Vue from 'vue';
import Router from 'vue-router';

import Login from './components/Login';
import Home from './components/Home';
import Welcome from './components/Welcome';
import UsersList from './components/User';
import RightsList from './components/Power';
import RolesList from './components/Power/Roles';
import Cate from './components/Goods/Cate';
import Params from './components/Goods/Params';
import GoodsList from './components/Goods';
import AddGoods from './components/Goods/AddGoods';
import EditGood from './components/Goods/EditGood';
import OrderList from './components/Order';

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
            redirect: '/welcome',
            children: [{
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/users',
                    component: UsersList
                },
                {
                    path: '/rights',
                    component: RightsList
                },
                {
                    path: '/roles',
                    component: RolesList
                },
                {
                    path: '/categories',
                    component: Cate
                },
                {
                    path: '/params',
                    component: Params
                },
                {
                    path: '/goods',
                    component: GoodsList
                },
                {
                    path: '/goods/add',
                    component: AddGoods
                },
                {
                    path: '/goods/edit',
                    component: EditGood,
                },
                {
                    path:'/orders',
                    component:OrderList
                }
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