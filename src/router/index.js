import { createRouter, createWebHistory } from "vue-router";

// Прямые импорты для теста
import MainPage from "../pages/MainPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
//import NewSpendPage from "../pages/NewSpendPage.vue";
import EditSpendPage from "../pages/EditSpendPage.vue";
import SpendAnalysisPage from "../pages/SpendAnalysisPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: MainPage,
    children: [
      //{path: "spend/new",name: "NewSpend",component: NewSpendPage,},
      {
        path: "spend/:id",
        name: "EditSpend",
        component: EditSpendPage,
        props: true,
      },
    ],
  },
  {
    path: "/spend-analysis",
    name: "SpendAnalysis",
    component: SpendAnalysisPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
