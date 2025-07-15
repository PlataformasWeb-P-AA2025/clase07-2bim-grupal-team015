<template>
  <div class="editar-telefono-container">
    <h2>Editar Número Telefónico</h2>
    <p v-if="loading">Cargando datos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <form v-else @submit.prevent="updateTelefono">
      <div>
        <label for="telefono">Número:</label>
        <input type="text" v-model="telefono.telefono" required />
      </div>
      <div>
        <label for="tipo">Tipo:</label>
        <input type="text" v-model="telefono.tipo" required />
      </div>
      <button type="submit" class="update-button">Actualizar Número</button>
      <button type="button" class="delete-button" @click="eliminarTelefono">
        Eliminar Número
      </button>
    </form>
    <router-link
      :to="{
        name: 'EstudianteDetail',
        params: { estudianteUrl: telefono.estudiante },
      }"
      class="back-button"
    >
      Volver al Detalle
    </router-link>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EditarTelefono",
  props: ["telefonoUrl"],
  data() {
    return {
      telefono: {},
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchTelefonoDetail();
  },
  methods: {
    async fetchTelefonoDetail() {
      const decodedUrl = decodeURIComponent(this.telefonoUrl);
      try {
        const response = await api.get(decodedUrl);
        this.telefono = response.data;
      } catch (err) {
        this.error = "No se pudo cargar el detalle del número telefónico.";
      } finally {
        this.loading = false;
      }
    },
    async updateTelefono() {
      try {
        await api.put(this.telefono.url, this.telefono);
        this.$router.push({
          name: "EstudianteDetail",
          params: { estudianteUrl: this.telefono.estudiante },
        });
      } catch (err) {
        this.error = "No se pudo actualizar el número telefónico.";
      }
    },
    async eliminarTelefono() {
      if (
        confirm("¿Estás seguro de que deseas eliminar este número telefónico?")
      ) {
        try {
          await api.delete(this.telefono.url);
          alert("Número telefónico eliminado con éxito.");
          this.$router.push({
            name: "EstudianteDetail",
            params: { estudianteUrl: this.telefono.estudiante },
          });
        } catch (err) {
          this.error = "No se pudo eliminar el número telefónico.";
        }
      }
    },
  },
};
</script>

<style scoped>
.editar-telefono-container {
  max-width: 600px;
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

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.back-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}

.update-button {
  background-color: #28a745; /* Verde para el botón de actualizar */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px; /* Espacio entre botones */
}

.update-button:hover {
  background-color: #218838; /* Color más oscuro al pasar el mouse */
}

.delete-button {
  background-color: #dc3545; /* Rojo para el botón de eliminar */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333; /* Color más oscuro al pasar el mouse */
}
</style>
