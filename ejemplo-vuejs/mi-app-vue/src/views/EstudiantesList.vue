<template>
  <div class="estudiantes-list-container">
    <h2>Listado de Estudiantes</h2>
    <p v-if="loading">Cargando estudiantes...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <ul v-else-if="estudiantes.length">
      <li
        v-for="estudiante in estudiantes"
        :key="estudiante.url"
        class="estudiante-item"
      >
        <router-link
          :to="{
            name: 'EstudianteDetail',
            params: { estudianteUrl: estudiante.url },
          }"
        >
          {{ estudiante.nombre }} {{ estudiante.apellido }} (Cédula:
          {{ estudiante.cedula }})
        </router-link>
        <button class="edit-button" @click="editarEstudiante(estudiante.url)">
          Editar
        </button>
        <button
          class="delete-button"
          @click="eliminarEstudiante(estudiante.url)"
        >
          Eliminar
        </button>
      </li>
    </ul>
    <p v-else>No hay estudiantes registrados.</p>
    <button class="add-button" disabled>Agregar Nuevo Estudiante</button>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudiantesList",
  data() {
    return {
      estudiantes: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchEstudiantes();
  },
  methods: {
    async fetchEstudiantes() {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get("estudiantes/");
        this.estudiantes = response.data.results || response.data;
        console.log("Estudiantes cargados:", this.estudiantes);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err.response || err);
        this.error =
          "No se pudieron cargar los estudiantes. Asegúrate de estar logueado.";
      } finally {
        this.loading = false;
      }
    },
    editarEstudiante(estudianteUrl) {
      this.$router.push({
        name: "EditarEstudiante",
        params: { estudianteUrl },
      });
    },
    async eliminarEstudiante(estudianteUrl) {
      if (confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
        try {
          await api.delete(estudianteUrl);
          this.estudiantes = this.estudiantes.filter(
            (est) => est.url !== estudianteUrl
          );
          alert("Estudiante eliminado con éxito.");
        } catch (err) {
          console.error("Error al eliminar estudiante:", err);
          alert("No se pudo eliminar el estudiante.");
        }
      }
    },
  },
};
</script>

<style scoped>
.estudiantes-list-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

.estudiante-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.estudiante-item:last-child {
  border-bottom: none;
}

.estudiante-item a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.estudiante-item a:hover {
  text-decoration: underline;
}

.add-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
  cursor: not-allowed; /* Cambia el cursor para indicar que está deshabilitado */
}

.add-button:hover {
  background-color: #218838; /* Cambia el color al pasar el mouse, aunque esté deshabilitado */
}

.edit-button {
  background-color: #28a745; /* Verde para el botón de editar */
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px; /* Espacio entre botones */
}

.edit-button:hover {
  background-color: #218838; /* Color más oscuro al pasar el mouse */
}

.delete-button {
  background-color: #dc3545; /* Rojo para el botón de eliminar */
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333; /* Color más oscuro al pasar el mouse */
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
