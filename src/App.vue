<template>
  <v-app>
    <v-app-bar app color="primary" dark> Pokedex </v-app-bar>
    <v-main>
      <div class="content">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Id</th>
                <th class="text-left">Name</th>
                <th class="text-left">Url</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.name">
                <td>{{ item.url | getIdFromUrl }}</td>
                <td>{{ item.name | capitalize }}</td>
                <td>{{ item.url }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    items: [],
  }),
  created() {
    let api = "https://pokeapi.co/api/v2/pokemon?limit=100";
    this.axios.get(api).then((response) => {
      console.log(response.data);
      this.items = response.data.results;
    });
  },
  filters: {
    capitalize(value) {
      const str = value;
      const str2 = str.charAt(0).toUpperCase() + str.slice(1);
      console.log(str2);
      return str2;
    },
    getIdFromUrl(value) {
      let array = value.split("/");
      console.log(JSON.stringify(array));
      return array[6];
    }
  },
};
</script>

<style scoped>
.content {
  padding: 30px;
}
</style>