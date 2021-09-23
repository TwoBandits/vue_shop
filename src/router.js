import Vue from 'vue';
import Router from 'vue-router';

import Login from './components/Login';
// const Login = () => import(/* webpackChunkName:"login_home_welcome" */'./components/Login.vue')

// 路由懒加载
// import Home from './components/Home';
const Home = () => import( /* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome';
const Welcome = () => import( /* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')

// import UsersList from './components/User';
const UsersList = () => import( /* webpackChunkName:"Users_Rights_Roles" */'./components/User')
// import RightsList from './components/Power';
const RightsList = () => import( /* webpackChunkName:"Users_Rights_Roles" */'./components/Power')
// import RolesList from './components/Power/Roles';
const RolesList = () => import( /* webpackChunkName:"Users_Rights_Roles" */'./components/Power/Roles.vue')

// import Cate from './components/Goods/Cate';
const Cate = () => import(/* webpackChunkName:"Cate_Params" */'./components/Goods/Cate.vue')
// import Params from './components/Goods/Params';
const Params = () => import(/* webpackChunkName:"Cate_Params" */'./components/Goods/Params.vue')

// import GoodsList from './components/Goods';
const GoodsList = () => import(/* webpackChunkName:"GoodsList_AddGoods_EditGood" */'./components/Goods')
// import AddGoods from './components/Goods/AddGoods';
const AddGoods = () => import(/* webpackChunkName:"GoodsList_AddGoods_EditGood" */'./components/Goods/AddGoods.vue')
// import EditGood from './components/Goods/EditGood';
const EditGood = () => import(/* webpackChunkName:"GoodsList_AddGoods_EditGood" */'./components/Goods/EditGood.vue')

// import OrderList from './components/Order';
const OrderList = () => import(/* webpackChunkName:"OrderList_Report" */'./components/Order')
// import Report from './components/Report';
const Report = () => import(/* webpackChunkName:"OrderList_Report" */'./components/Report')

Vue.use(Router);

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/login',
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
                    path: '/orders',
                    component: OrderList
                },
                {
                    path: '/reports',
                    component: Report
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