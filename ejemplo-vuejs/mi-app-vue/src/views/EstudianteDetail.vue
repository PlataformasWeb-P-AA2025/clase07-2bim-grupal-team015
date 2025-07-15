<template>
  <div class="estudiante-detail-container">
    <h2>Detalle del Estudiante</h2>

    <p v-if="loading">Cargando detalles...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-if="estudiante && !loading" class="estudiante-info">
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

      <div v-if="numerosTelefonicos.length > 0" class="telefonos-list">
        <div
          v-for="telefono in numerosTelefonicos"
          :key="telefono.id"
          class="telefono-item"
        >
          <p>{{ telefono.telefono }} ({{ telefono.tipo }})</p>
          <div class="telefono-actions">
            <button class="small-edit" @click="editarTelefono(telefono.id)">
              Editar Teléfono
            </button>
            <button class="small-delete" @click="eliminarTelefono(telefono.id)">
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
  props: {
    estudianteUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      estudiante: null,
      numerosTelefonicos: [],
      loading: false,
      error: null,
    };
  },
  watch: {
    estudianteUrl: {
      immediate: true,
      handler() {
        this.cargarDatos();
      },
    },
  },
  methods: {
    async cargarDatos() {
      this.loading = true;
      this.error = null;
      try {
        const decodedUrl = decodeURIComponent(this.estudianteUrl);

        // Obtener datos del estudiante
        const respEstudiante = await api.get(decodedUrl);
        this.estudiante = respEstudiante.data;

        // Obtener teléfonos
        const respTelefonos = await api.get("numerosts/");

        // Extraer ID del estudiante de la URL (último segmento)
        const partes = decodedUrl.split("/").filter(Boolean);
        const estudianteId = partes[partes.length - 1];

        // Filtrar teléfonos del estudiante y extraer id del teléfono de la URL
        this.numerosTelefonicos = respTelefonos.data.results
          .filter((t) => t.estudiante.endsWith(`${estudianteId}/`))
          .map((t) => ({
            ...t,
            id: t.url.split("/").filter(Boolean).pop(), // Extrae el id del final de la url
          }));
      } catch (error) {
        this.error =
          "Error al cargar los datos del estudiante o números telefónicos.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    editarEstudiante() {
      this.$router.push({
        name: "EditarEstudiante",
        params: { estudianteUrl: this.estudianteUrl },
      });
    },
    async eliminarEstudiante() {
      if (
        confirm(
          "¿Está seguro que desea eliminar este estudiante y todos sus teléfonos?"
        )
      ) {
        try {
          const url = decodeURIComponent(this.estudianteUrl);
          await api.delete(url);
          this.$router.push({ name: "EstudiantesList" });
        } catch (error) {
          this.error = "Error al eliminar el estudiante.";
          console.error(error);
        }
      }
    },
    editarTelefono(telefonoId) {
      if (!telefonoId) {
        alert("ID de teléfono no definido para editar.");
        return;
      }
      const telefonoUrl = encodeURIComponent(`numerosts/${telefonoId}/`);
      this.$router.push({
        name: "EditarTelefono",
        params: { telefonoUrl, estudianteUrl: this.estudianteUrl },
      });
    },
    async eliminarTelefono(telefonoId) {
      if (!telefonoId) {
        alert("ID de teléfono no definido para eliminar.");
        return;
      }
      if (confirm("¿Está seguro que desea eliminar este número telefónico?")) {
        try {
          const url = `numerosts/${telefonoId}/`;
          await api.delete(url);
          this.numerosTelefonicos = this.numerosTelefonicos.filter(
            (t) => t.id !== telefonoId
          );
        } catch (error) {
          this.error = "Error al eliminar el teléfono.";
          console.error(error);
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
