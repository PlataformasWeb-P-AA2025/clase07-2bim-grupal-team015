import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import EstudiantesList from "../views/EstudiantesList.vue";
import EstudianteDetail from "../views/EstudianteDetail.vue";
import EditarEstudiante from "../views/EditarEstudiante.vue";
import EditarTelefono from "../views/EditarTelefono.vue";
import AgregarEstudiante from "../views/AgregarEstudiante.vue";
import AgregarTelefono from "../views/AgregarTelefono.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/estudiantes",
    name: "EstudiantesList",
    component: EstudiantesList,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/detail/:estudianteUrl",
    name: "EstudianteDetail",
    component: EstudianteDetail,
    props: true,
  },
  {
    path: "/estudiantes/editar/:estudianteUrl",
    name: "EditarEstudiante",
    component: EditarEstudiante,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/telefonos/editar/:telefonoUrl/:estudianteUrl",
    name: "EditarTelefono",
    component: EditarTelefono,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/nuevo",
    name: "AgregarEstudiante",
    component: AgregarEstudiante,
    meta: { requiresAuth: true },
  },
  {
    path: "/telefonos/nuevo",
    name: "AgregarTelefono",
    component: AgregarTelefono,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(), // aquí sin parámetro para evitar error
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("authToken")) {
    next("/login");
  } else {
    next();
  }
});

export default router;
