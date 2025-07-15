<template>
  <div class="estudiante-detail-container">
    <h2>Detalle del Estudiante</h2>
    <p v-if="loading">Cargando detalles...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-if="estudiante" class="estudiante-info">
      <h3>{{ estudiante.nombre }} {{ estudiante.apellido }}</h3>
      <p><strong>Cédula:</strong> {{ estudiante.cedula }}</p>
      <p><strong>Correo:</strong> {{ estudiante.correo }}</p>

      <div class="estudiante-actions">
        <button class="edit-button" @click="editarEstudiante">
          Editar Estudiante
        </button>
        <button class="delete-button" @click="eliminarEstudiante">
          Eliminar Estudiante
        </button>
      </div>

      <h4>Números Telefónicos:</h4>
      <div v-if="numerosTelefonicos.length" class="telefonos-list">
        <div
          v-for="numero in numerosTelefonicos"
          :key="numero.url"
          class="telefono-item"
        >
          <p>{{ numero.telefono }} ({{ numero.tipo }})</p>
          <div class="telefono-actions">
            <button class="small-edit" @click="editarTelefono(numero.url)">
              Editar Teléfono
            </button>
            <button class="small-delete" @click="eliminarTelefono(numero.url)">
              Eliminar Teléfono
            </button>
          </div>
        </div>
      </div>
      <p v-else>No tiene números telefónicos registrados.</p>

      <router-link :to="{ name: 'EstudiantesList' }" class="back-button">
        Volver al Listado
      </router-link>
    </div>
    <p v-else-if="!loading">Estudiante no encontrado.</p>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudianteDetail",
  props: ["estudianteUrl"],
  data() {
    return {
      estudiante: null,
      numerosTelefonicos: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    try {
      // Cargar datos del estudiante
      const decodedUrl = decodeURIComponent(this.estudianteUrl);
      const estudianteResponse = await api.get(decodedUrl);
      this.estudiante = estudianteResponse.data;

      // Cargar números telefónicos
      const telefonosResponse = await api.get("numerosts/");
      this.numerosTelefonicos = telefonosResponse.data.results.filter(
        (t) => t.estudiante === decodedUrl
      );
    } catch (err) {
      this.error =
        "Error al cargar los datos del estudiante o números telefónicos.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    editarEstudiante() {
      this.$router.push({
        name: "EditarEstudiante",
        params: { estudianteUrl: this.estudiante.url },
      });
    },
    async eliminarEstudiante() {
      if (confirm("¿Eliminar este estudiante y todos sus teléfonos?")) {
        try {
          await api.delete(this.estudiante.url);
          this.$router.push({ name: "EstudiantesList" });
        } catch (err) {
          this.error = "Error al eliminar el estudiante.";
        }
      }
    },
    editarTelefono(telefonoUrl) {
      this.$router.push({
        name: "EditarTelefono",
        params: { telefonoUrl },
      });
    },
    async eliminarTelefono(telefonoUrl) {
      if (confirm("¿Eliminar este número telefónico?")) {
        try {
          await api.delete(telefonoUrl);
          this.numerosTelefonicos = this.numerosTelefonicos.filter(
            (t) => t.url !== telefonoUrl
          );
        } catch (err) {
          this.error = "Error al eliminar el teléfono.";
        }
      }
    },
  },
};
</script>

<style scoped>
.estudiante-detail-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.estudiante-info {
  margin-top: 20px;
}

.estudiante-actions {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.edit-button {
  background: #28a745;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button {
  background: #dc3545;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.telefonos-list {
  margin-top: 20px;
}

.telefono-item {
  padding: 15px;
  margin-bottom: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.telefono-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.small-edit {
  background: #17a2b8;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  font-size: 0.9em;
  cursor: pointer;
}

.small-delete {
  background: #ffc107;
  color: #212529;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  font-size: 0.9em;
  cursor: pointer;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 8px 15px;
  background: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin: 20px 0;
}
</style>
