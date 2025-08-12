<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Edit Role</div>
      </q-card-section>

      <!-- Error Alert -->
      <q-banner v-if="errorMessage" class="bg-red-2 text-red-10 q-mb-md rounded-borders" inline-actions
        style="border: 1px solid #f5c6cb; white-space: pre-line;">
        <div class="text-caption">
          {{ errorMessage }}
        </div>

        <template v-slot:action>
          <q-btn flat dense round icon="close" size="sm" class="text-red-10" @click="errorMessage = ''" />
        </template>
      </q-banner>




      <q-card-section>
        <q-form @submit.prevent="updateRole">
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

          <!-- Action Buttons -->
          <div class="q-gutter-sm row items-center">
            <q-btn color="primary" label="Update" type="submit" />
            <q-btn color="grey" label="Cancel" to="/userprivileges/userroles" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "EditUserRole",
  data() {
    return {
      role: { code: "", name: "", description: "", parent: null, active: false },
      successMessage: "",
      errorMessage: "",
      fieldErrors: {}
    };
  },
  async mounted() {
    const roleId = this.$route.params.id;
    try {
      const response = await this.$axios.get(`/users/role/${roleId}`);
      const data = response.data;

      // Map backend property to frontend
      this.role = {
        code: data.code || "",
        name: data.name || "",
        description: data.description || "",
        parent: data.parentRole || null, // mapping here
      };
    } catch (error) {
      this.errorMessage = error.response?.data?.message || 'Failed to load role';
    }
  },
  methods: {
    async updateRole() {
      this.successMessage = "";
      this.errorMessage = "";
      this.fieldErrors = {};

      try {
        const roleId = this.$route.params.id;
        const response = await this.$axios.put(`/users/role/${roleId}`, this.role);
        const message = response.data.summary || 'Role updated successfully!';
        this.$router.push({
          path: `/userprivileges/userroles/view/${roleId}`,
          state: { successMessage: message }
        });


      } catch (error) {
        if (error.response?.data?.detail?.errors) {
          error.response.data.detail.errors.forEach(err => {
            this.fieldErrors[err.field] = err.message;
          });
          this.errorMessage = error.response.data.detail.errors
            .map(err => `${err.label}: ${err.message}`)
            .join('\n');
        } else {
          this.errorMessage = error.response?.data?.message || 'Failed to update role';
        }
      }
    }
  }
};
</script>
