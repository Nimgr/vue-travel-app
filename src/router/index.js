import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import store from "@/store";
Vue.use(Router);

const router = new Router({
  mode: "history",
  linkExactActiveClass: "vue-school-active-class",
  scrollBehavior(to, from, savedPosition){
    if(savedPosition){
      return savedPosition;
    } else {
      const position = {};
      if (to.hash) {
        position.selector = to.hash;
        if(to.hash === '#experience') {
          position.offset = { y: 140 };
        }
        if(document.querySelector(to.hash)) {
          return position;
        }
        return false;
      }
    }
  },
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      props: true
    },
    // {
    //   path: "/about",
    //   name: "About",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "../views/About.vue")
    // },
    // {
    //   path: "/brazil",
    //   name: "brazil",
    //   component: () => import(/* webpackChunkName: "brazil" */ "../views/Brazil")
    // },
    // {
    //   path: "/hawaii",
    //   name: "hawaii",
    //   component: () => import(/* webpackChunkName: "hawaii" */ "../views/Hawaii")
    // },
    // {
    //   path: "/panama",
    //   name: "panama",
    //   component: () => import(/* webpackChunkName: "panama" */ "../views/Panama")
    // },
    // {
    //   path: "/jamaica",
    //   name: "jamaica",
    //   component: () => import(/* webpackChunkName: "jamaica" */ "../views/Jamaica")
    // },
    {
      path: "/destination/:slug",
      name: "DestinationDetails",
      props: true,
      component: () => import(/* webpackChunkName: "DestinationDetails" */ "../views/DestinationDetails"),
      children: [
        {
          path: ":experienceSlug",
          name: "experienceDetails",
          props: true,
          component: () => import(/* webpackChunkName: "ExperienceDetails" */ "../views/ExperienceDetails")
        }
      ],
      beforeEnter: (to, from, next) => {
        const exists = store.destinations.find(
          destination => destination.slug === to.params.slug
        );
        if(exists){
          next();
        } else {
          next({ name: "notFound" });
        }
      }
    },
    {
      path: "/user",
      name: "user",
      component: () => import(/* webpackChunkName: "User" */ "../views/User"),
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      name: "login",
      component: () => import(/* webpackChunkName: "Login" */ "../views/Login"),
    },
    {
      path: "/invoices",
      name: "invoices",
      component: () => import(/* webpackChunkName: "Invoices" */ "../views/Invoices"),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/404",
      alias: "*",
      name: "notFound",
      component: () => import(/* webpackChunkName: "NotFound" */ "../views/NotFound")
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
  // if(to.meta.requiresAuth){
    if (!store.user) {
      next({
        name: "login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
    // need to login
  } else {
    next();
  }
});

export default router;