import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue"; // Componente de login
import EstudiantesList from "../views/EstudiantesList.vue"; // Componente de lista de estudiantes
import EstudianteDetail from "../views/EstudianteDetail.vue"; // Componente de detalle de estudiante
import EditarEstudiante from "../views/EditarEstudiante.vue"; // Componente para editar estudiante
import EditarTelefono from "../views/EditarTelefono.vue"; // Componente para editar número telefónico
import AgregarEstudiante from "../views/AgregarEstudiante.vue"; // Componente para agregar estudiante
import AgregarTelefono from "../views/AgregarTelefono.vue"; // Componente para agregar número de teléfono

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
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: "/estudiantes/detail/:estudianteUrl", // Ruta para ver detalles de un estudiante
    name: "EstudianteDetail",
    component: EstudianteDetail,
    props: true, // Pasa el ':estudianteUrl' como una prop al componente EstudianteDetail
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/editar/:estudianteUrl", // Ruta para editar un estudiante
    name: "EditarEstudiante",
    component: EditarEstudiante,
    props: true, // Pasa el ':estudianteUrl' como una prop al componente EditarEstudiante
    meta: { requiresAuth: true },
  },
  {
    path: "/telefonos/editar/:telefonoUrl/:estudianteUrl", // Ruta para editar un número telefónico
    name: "EditarTelefono",
    component: EditarTelefono,
    props: true, // Pasa el ':telefonoUrl' y ':estudianteUrl' como props al componente EditarTelefono
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/nuevo", // Ruta para agregar un nuevo estudiante
    name: "AgregarEstudiante",
    component: AgregarEstudiante,
    meta: { requiresAuth: true },
  },
  {
    path: "/telefonos/nuevo", // Ruta para agregar un nuevo número de teléfono
    name: "AgregarTelefono",
    component: AgregarTelefono,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guarda de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("authToken")) {
    next("/login"); // Redirige al login si no está autenticado
  } else {
    next();
  }
});

export default router;
