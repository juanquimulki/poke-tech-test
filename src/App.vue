<template>
  <v-app>
    <v-app-bar app color="primary" dark> Pokedex </v-app-bar>
    <v-main>
      <div class="content">
        <v-row>
          <v-col cols="12" xs="1" sm="3" md="3" lg="2">
            <v-combobox
              v-model="paging"
              :items="recordsPaging"
              label="Records per Page"
              outlined
              dense
            ></v-combobox>
          </v-col>
          <v-col cols="12" xs="1" sm="3" md="3" lg="2"
            ><v-btn color="primary" elevation="2">REQUEST</v-btn>
            <v-progress-circular
              v-if="spinner"
              indeterminate
              color="red"
            ></v-progress-circular>
          </v-col>
        </v-row>

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

        <v-btn elevation="2" :disabled="prevDisabled" @click="prevPage">{{
          prevLabel
        }}</v-btn>
        <v-btn elevation="2" :disabled="nextDisabled" @click="nextPage">{{
          nextLabel
        }}</v-btn>
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

    paging: [5],
    recordsPaging: [5, 10, 20, 50, 100],

    prevLabel: "<< PREV",
    nextLabel: "NEXT >>",

    prevUrl: null,
    nextUrl: null,

    spinner: false,
  }),
  created() {
    let api = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=5";
    this.axios.get(api).then((response) => {
      console.log(response.data);
      this.items = response.data.results;
      this.nextUrl = response.data.next;
      this.prevUrl = response.data.previous;
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
    },
  },
  methods: {
    nextPage() {
      this.spinner = true;
      let api = this.nextUrl;
      this.axios.get(api).then((response) => {
        console.log(response.data);
        this.items = response.data.results;
        this.nextUrl = response.data.next;
        this.prevUrl = response.data.previous;
        this.spinner = false;
      });
    },
    prevPage() {
      let api = this.prevUrl;
      this.axios.get(api).then((response) => {
        console.log(response.data);
        this.items = response.data.results;
        this.nextUrl = response.data.next;
        this.prevUrl = response.data.previous;
      });
    },
  },
  computed: {
    prevDisabled() {
      return this.prevUrl == null;
    },
    nextDisabled() {
      return this.nextUrl == null;
    },
  },
};
</script>

<style scoped>
.content {
  padding: 30px;
}
.v-btn {
  margin-right: 5px;
}
</style>