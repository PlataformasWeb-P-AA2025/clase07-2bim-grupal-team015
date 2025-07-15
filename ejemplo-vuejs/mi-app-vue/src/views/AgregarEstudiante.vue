<template>
  <div class="agregar-estudiante-container">
    <h2>Agregar Nuevo Estudiante</h2>

    <p v-if="loading">Guardando estudiante...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <form @submit.prevent="guardarEstudiante" class="estudiante-form">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          v-model="nuevoEstudiante.nombre"
          required
          placeholder="Ingrese el nombre"
        />
      </div>

      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          v-model="nuevoEstudiante.apellido"
          required
          placeholder="Ingrese el apellido"
        />
      </div>

      <div class="form-group">
        <label for="cedula">Cédula:</label>
        <input
          type="text"
          id="cedula"
          v-model="nuevoEstudiante.cedula"
          required
          placeholder="Ingrese la cédula"
        />
      </div>

      <div class="form-group">
        <label for="correo">Correo:</label>
        <input
          type="email"
          id="correo"
          v-model="nuevoEstudiante.correo"
          required
          placeholder="Ingrese el correo electrónico"
        />
      </div>

      <div class="button-group">
        <button type="submit" class="save-button" :disabled="loading">
          Guardar Estudiante
        </button>
        <router-link :to="{ name: 'EstudiantesList' }" class="cancel-button">
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "AgregarEstudiante",
  data() {
    return {
      nuevoEstudiante: {
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async guardarEstudiante() {
      try {
        this.loading = true;
        this.error = null;

        await api.post("estudiantes/", this.nuevoEstudiante);

        // Redirigir a la lista de estudiantes después de guardar
        this.$router.push({
          name: "EstudiantesList",
          query: { refresh: true }, // Opcional: para forzar refresco de datos
        });
      } catch (error) {
        console.error("Error al guardar estudiante:", error);
        this.error =
          error.response?.data?.message || "Error al guardar el estudiante";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.agregar-estudiante-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
}

.estudiante-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.save-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin: 15px 0;
}
</style>
