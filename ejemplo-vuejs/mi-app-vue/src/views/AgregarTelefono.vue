<template>
  <div class="agregar-telefono-container">
    <h2>Agregar Nuevo Teléfono</h2>

    <div v-if="loading" class="loading-message">Cargando estudiantes...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <form
      v-if="!loading && !error"
      @submit.prevent="guardarTelefono"
      class="telefono-form"
    >
      <div class="form-group">
        <label for="estudiante">Seleccionar Estudiante:</label>
        <select
          v-model="telefonoData.estudianteUrl"
          id="estudiante"
          required
          class="form-select"
        >
          <option value="" disabled selected>Seleccione un estudiante</option>
          <option
            v-for="estudiante in estudiantes"
            :key="estudiante.url"
            :value="estudiante.url"
          >
            {{ estudiante.nombre }} {{ estudiante.apellido }} ({{
              estudiante.cedula
            }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="telefono">Número de Teléfono:</label>
        <input
          type="text"
          id="telefono"
          v-model="telefonoData.numero"
          required
          placeholder="Ejemplo: 0987654321"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="tipo">Tipo de Teléfono:</label>
        <select
          v-model="telefonoData.tipo"
          id="tipo"
          required
          class="form-select"
        >
          <option value="" disabled selected>Seleccione un tipo</option>
          <option value="personal">Personal</option>
          <option value="casa">Casa</option>
          <option value="trabajo">Trabajo</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancelar" class="cancel-button">
          Cancelar
        </button>
        <button type="submit" :disabled="saving" class="save-button">
          {{ saving ? "Guardando..." : "Guardar Teléfono" }}
        </button>
      </div>
    </form>

    <div class="back-link">
      <router-link :to="{ name: 'EstudiantesList' }">
        ← Volver a la lista de estudiantes
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "AgregarTelefono",
  data() {
    return {
      estudiantes: [],
      telefonoData: {
        estudianteUrl: "",
        numero: "",
        tipo: "",
      },
      loading: false,
      saving: false,
      error: null,
    };
  },
  async created() {
    await this.cargarEstudiantes();
  },
  methods: {
    async cargarEstudiantes() {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get("estudiantes/");
        this.estudiantes = response.data.results || response.data;
      } catch (err) {
        console.error("Error al cargar estudiantes:", err);
        this.error =
          "Error al cargar la lista de estudiantes. Intente nuevamente.";
      } finally {
        this.loading = false;
      }
    },
    async guardarTelefono() {
      try {
        this.saving = true;
        this.error = null;

        // Asegúrate de que la URL de la API sea correcta según tu backend
        await api.post("telefonos/", {
          telefono: this.telefonoData.numero,
          tipo: this.telefonoData.tipo,
          estudiante: this.telefonoData.estudianteUrl,
        });

        this.$router.push({
          name: "EstudianteDetail",
          params: { estudianteUrl: this.telefonoData.estudianteUrl },
        });
      } catch (error) {
        console.error("Error al guardar teléfono:", error);
        this.error =
          error.response?.data?.message ||
          "Error al guardar el teléfono. Verifique los datos.";
      } finally {
        this.saving = false;
      }
    },
    cancelar() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.agregar-telefono-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
}

.loading-message {
  background: #f8f9fa;
  color: #6c757d;
}

.error-message {
  background: #f8d7da;
  color: #dc3545;
}

.telefono-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-select,
.form-input {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-button:hover {
  background: #5a6268;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.save-button:hover {
  background: #218838;
}

.save-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.back-link {
  margin-top: 2rem;
  text-align: center;
}

.back-link a {
  color: #007bff;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
