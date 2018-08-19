import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/pages/index'
import searchResult from '@/components/pages/searchResult'
import movieInfo from '@/components/pages/movieInfo'
import watch from '@/components/pages/watchPage'
import login from '@/components/pages/login'
import register from '@/components/pages/register'
import forget from '@/components/pages/forgetPsw'
import personal from '@/components/pages/personal'
import notice from '@/components/pages/notice'
import vemail from '@/components/pages/verifyMail'
import announce from '@/components/pages/announce'
import test from '@/components/pages/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path:'/announce',
      name:'announce',
      component: announce
    },
    {
      path:'/announce/:id',
      name:'announce',
      component: announce
    },
    {
      path: '/searchResult',
      name: 'searchResult',
      component: searchResult
    },
    {
      path: '/movieInfo',
      name: 'movieInfo',
      component: movieInfo
    },
    {
      path: '/video',
      name: 'watch',
      component: watch
    },
    {
      path: '/video/:epid',
      name: 'watch',
      component: watch
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal
    },
    {
      path: '/notice',
      name: 'notice',
      component: notice
    },
    {
      path: '/vemail',
      name: 'vemail',
      component: vemail
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
  ]
})
