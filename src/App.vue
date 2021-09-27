<template>
  <v-app>
    <v-app-bar app color="primary" dark> Pokedex </v-app-bar>
    <v-main>
      <div class="content">Hello World!</div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),
  created() {
    let api = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=200";
    this.axios.get(api).then((response) => {
      console.log(response.data);
    });
  },
};
</script>

<style scoped>
.content {
  padding: 15px;
}
</style>