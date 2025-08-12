<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Add New Role</div>
      </q-card-section>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="row items-center bg-red-2 text-red-10 q-mb-md q-pa-sm rounded-borders"
        style="border: 1px solid #f5c6cb; white-space: pre-line;">
        <div class="col-grow text-caption">
          {{ errorMessage }}
        </div>
        <q-btn flat dense icon="close" size="sm" @click="errorMessage = ''" class="q-ml-sm text-red-10" />
      </div>

      <!-- Success Alert -->
      <div v-else-if="successMessage" class="row items-center bg-green-2 text-green-10 q-mb-md q-pa-sm rounded-borders"
        style="border: 1px solid #c3e6cb;">
        <div class="col-grow text-caption">
          {{ successMessage }}
        </div>
        <q-btn flat dense icon="close" size="sm" @click="successMessage = ''" class="q-ml-sm text-green-10" />
      </div>

      <q-card-section>
        <q-form @submit.prevent="saveRole">
          <!-- Role Code -->
          <q-input outlined v-model="role.code" label="Role Code" class="q-mb-md" :rules="[
            val => !!val || 'Userrole Code Required',
            val => /^[a-zA-Z0-9_/]+$/.test(val) || 'Only alphanumeric, underscores, and slashes allowed'
          ]" :error="!!fieldErrors.code" :error-message="fieldErrors.code" />

          <!-- Role Name -->
          <q-input outlined v-model="role.name" label="Role Name" class="q-mb-md" :rules="[
            val => !!val || 'Role Name Required',
            val => /^[A-Za-z ]+$/.test(val) || 'Only alphabets allowed'
          ]" :error="!!fieldErrors.name" :error-message="fieldErrors.name" />

          <!-- Description -->
          <q-input outlined v-model="role.description" label="Description" type="textarea" autogrow filled counter
            maxlength="50" class="q-mb-md" :error="!!fieldErrors.description"
            :error-message="fieldErrors.description" />

          <!-- Status -->
          <q-checkbox v-model="role.active" label="Status" class="q-mb-md" />

          <!-- Action Buttons -->
          <div class="q-gutter-sm row items-center">
            <q-btn color="primary" label="Save" type="submit" />
            <q-btn color="grey" label="Cancel" to="/userprivileges/userroles" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "AddUserRole",
  data() {
    return {
      role: { code: "", name: "", description: "", parent: null, active: false },
      successMessage: "",
      errorMessage: "",
      fieldErrors: {} // Store API validation errors per field
    };
  },
  methods: {
    async saveRole() {
      this.successMessage = "";
      this.errorMessage = "";
      this.fieldErrors = {};

      try {
        const response = await this.$axios.post('/users/role', this.role);
        this.successMessage = response.data.summary || 'Role saved successfully!';
      } catch (error) {
        if (error.response?.data?.detail?.errors) {
          // Map field errors
          error.response.data.detail.errors.forEach(err => {
            this.fieldErrors[err.field] = err.message;
          });

          // General multi-line error message
          this.errorMessage = error.response.data.detail.errors
            .map(err => `${err.label}: ${err.message}`)
            .join('\n');
        } else {
          this.errorMessage = error.response?.data?.message || 'Failed to save role';
        }
      }
    }
  }
};
</script>
