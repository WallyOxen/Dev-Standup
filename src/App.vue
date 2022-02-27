<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      class="pt-4"
      color="grey lighten-3"
      mini-variant
    >
      <v-tooltip v-for="route in routes" :key="route.path" right>
        <template v-slot:activator="{ on }">
          <router-link :to="route.path">
            <v-icon
              v-on="on"
              :color="route.path === $route.path ? route.color : ''"
              :size="route.path === $route.path ? 36 : 20"
              class="d-block text-center mx-auto mb-9"
            >
              {{ route.icon }}
            </v-icon>
          </router-link>
        </template>
        <span>{{ route.name }}</span>
      </v-tooltip>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "dev-standup",
  data: () => ({
    drawer: true,
    routes: [
      {
        name: "Notes",
        path: "/",
        icon: "mdi-text",
        color: "purple",
      },
      {
        name: "Users",
        path: "/users",
        icon: "mdi-account-outline",
        color: "orange",
      },
    ],
  }),
};
</script>
