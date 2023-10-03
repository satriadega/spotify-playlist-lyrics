import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import BaseLayout from "../views/BaseLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: BaseLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: HomeView,
        },
        {
          path: "/login",
          name: "login",
          component: LoginView,
        },
      ],
    },
  ],
});

export default router;

// [
//   { path: "/", name: "home", component: HomeView },
//   {
//     path: "/login",
//     name: "login",
//     component: LoginView,
//   },
// ],
