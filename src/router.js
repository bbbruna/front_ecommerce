import { createRouter, createWebHistory } from 'vue-router';
import ProductsList from '@/components/ProductsList.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import LoginPage from '@/components/LoginPage.vue';
import CarrinhoPage from '@/components/CarrinhoPage.vue';

const routes = [
  {
    path: '/',
    name: 'ProductsList',
    component: ProductsList,
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/carrinho',
    name: 'CarrinhoPage',
    component: CarrinhoPage
  },
];

const router = createRouter({
  history: createWebHistory(), // Use createWebHistory em vez de mode
  routes,
});

export default router;
