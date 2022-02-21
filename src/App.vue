<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      class="pt-4"
      color="grey lighten-3"
      mini-variant
    >
      <router-link v-for="route in routes" :key="route.path" :to="route.path">
        <v-avatar
          :color="`grey ${route.path === $route.path ? 'darken' : 'lighten'}-1`"
          :size="route.path === $route.path ? 36 : 20"
          class="d-block text-center mx-auto mb-9"
        >
        </v-avatar>
      </router-link>
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
      },
      {
        name: "Users",
        path: "/users",
      },
    ],
  }),
};
</script>
