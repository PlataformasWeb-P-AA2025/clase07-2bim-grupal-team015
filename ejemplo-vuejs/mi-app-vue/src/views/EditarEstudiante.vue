<template>
  <div class="editar-estudiante-container">
    <h2>Editar Datos del Estudiante</h2>
    <p v-if="loading">Cargando datos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <form v-else @submit.prevent="updateEstudiante">
      <div>
        <label>Nombre:</label>
        <input type="text" v-model="estudiante.nombre" required />
      </div>
      <div>
        <label>Apellido:</label>
        <input type="text" v-model="estudiante.apellido" required />
      </div>
      <div>
        <label>Cédula:</label>
        <input type="text" v-model="estudiante.cedula" required />
      </div>
      <div>
        <label>Correo:</label>
        <input type="email" v-model="estudiante.correo" required />
      </div>

      <div class="button-group">
        <button type="submit" class="update-button">Guardar Cambios</button>
        <button type="button" class="cancel-button" @click="cancelar">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EditarEstudiante",
  props: ["estudianteUrl"],
  data() {
    return {
      estudiante: {
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
      },
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchEstudianteDetail();
  },
  methods: {
    async fetchEstudianteDetail() {
      try {
        const response = await api.get(this.estudianteUrl);
        this.estudiante = response.data;
      } catch (err) {
        this.error = "Error al cargar datos del estudiante";
      } finally {
        this.loading = false;
      }
    },
    async updateEstudiante() {
      try {
        await api.put(this.estudiante.url, this.estudiante);
        this.$router.push({
          name: "EstudianteDetail",
          params: { estudianteUrl: this.estudiante.url },
        });
      } catch (err) {
        this.error = "Error al actualizar estudiante";
      }
    },
    cancelar() {
      this.$router.go(-1); // Regresa a la página anterior
    },
  },
};
</script>

<style scoped>
.editar-estudiante-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.update-button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: #dc3545;
  text-align: center;
}
</style>
