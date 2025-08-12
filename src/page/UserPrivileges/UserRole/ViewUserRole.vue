<template>
  <q-banner
  v-if="successMessage"
  class="bg-green-2 text-green-10 q-mb-md rounded-borders"
  inline-actions
  style="border: 1px solid #c3e6cb;"
>
  <div class="text-caption">
    {{ successMessage }}
  </div>

  <template v-slot:action>
    <q-btn
      flat
      dense
      round
      icon="close"
      size="sm"
      class="text-green-10"
      @click="successMessage = ''"
    />
  </template>
</q-banner>

  <q-page class="q-pa-md">
    <q-card>
      <!-- Top section with title and actions aligned horizontally -->
      <q-card-section class="row justify-between items-center">
        <div class="text-h6">View Role</div>
        <div>
          <q-btn
            color="primary"
            v-if="role.active === true"
            label="Edit"
            :to="{ name: 'edit-user-role', params: { id: $route.params.id } }"
            class="q-mr-sm"
          />
          <q-btn color="grey" label="Back" @click="$router.go(-1)" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list bordered padding>
          <q-item>
            <q-item-section>
              <q-item-label caption>Role Code</q-item-label>
              <q-item-label>{{ role.code }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Role Name</q-item-label>
              <q-item-label>{{ role.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Description</q-item-label>
              <q-item-label>{{ role.description }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Parent Role</q-item-label>
              <q-item-label>{{ role.parentRole || 'None' }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>Status</q-item-label>
              <q-item-label>{{ role.active ? 'Active' : 'Inactive' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "ViewUserRole",
  data() {
    return {
      role: {}
    };
  },
  async mounted() {
    const roleId = this.$route.params.id;
    try {
      const response = await this.$axios.get(`/users/role/${roleId}`);
      this.role = response.data;
    } catch (error) {
      console.error("Failed to load role", error);
    }
  }
};
</script>
