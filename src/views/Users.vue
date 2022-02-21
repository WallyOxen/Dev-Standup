<template>
  <div id="users">
    <v-card>
      <v-card-title class="d-flex justify-center">Developers</v-card-title>
      <v-card-text>
        <v-progress-linear v-if="loading" color="orange" indeterminate />
        <v-list>
          <template v-for="dev in devs">
            <v-list-item :key="dev.id">
              <v-list-item-content class="d-flex justify-center">
                {{ dev.name }}
              </v-list-item-content>
              <v-list-item-action v-if="dev.left" style="position: absolute">
                <v-btn icon @click="join(dev.id)">
                  <v-icon color="error" large> mdi-close </v-icon>
                </v-btn>
              </v-list-item-action>

              <v-list-item-action
                v-if="!dev.left"
                style="position: absolute; right: 0"
              >
                <v-btn icon @click="leave(dev.id)">
                  <v-icon color="error" large> mdi-close </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="dev.id + 'divider'" />
          </template>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Add a Developer</v-list-item-title>
              <v-text-field
                label="Name"
                v-model="newDevName"
                @keydown.enter="addDev"
              />
              <v-btn color="primary" @click="addDev">Add Developer</v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "users",
  data: () => ({
    devs: {},
    newDevName: "",
    loading: false,
  }),
  async mounted() {
    this.loading = true;
    const knownDevs = await this.$api.getAllDevs();
    knownDevs.forEach((dev) => {
      this.$set(this.devs, dev.id, dev);
    });
    this.loading = false;
  },
  methods: {
    async leave(id) {
      this.loading = true;
      const response = await this.$api.devLeft(id);
      this.$set(this.devs, response[0].id, response[0]);
      this.loading = false;
    },
    async join(id) {
      this.loading = true;
      const response = await this.$api.devJoined(id);
      this.$set(this.devs, response[0].id, response[0]);
      this.loading = false;
    },
    async addDev() {
      this.loading = true;
      const response = await this.$api.addDev(this.newDevName);
      this.$set(this.devs, response[0].id, response[0]);
      this.newDevName = "";
      this.loading = false;
    },
  },
};
</script>

<style>
#users {
  height: 100%;
}
</style>
