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
            ><v-btn color="primary" elevation="2" @click="request"
              >REQUEST</v-btn
            >
            <v-progress-circular
              v-if="spinner"
              indeterminate
              color="red"
            ></v-progress-circular>
          </v-col>
        </v-row>

        <PokeTable :fields="tableFields" :items="items"></PokeTable>

        <v-btn elevation="2" :disabled="prevDisabled" @click="prevPage">{{
          prevLabel
        }}</v-btn>
        <v-btn elevation="2" :disabled="nextDisabled" @click="nextPage">{{
          nextLabel
        }}</v-btn>
        <v-progress-circular
          v-if="spinner"
          indeterminate
          color="red"
        ></v-progress-circular>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import PokeTable from "./components/PokeTable.vue";

export default {
  name: "App",

  components: { PokeTable },

  data: () => ({
    tableFields: ["Id", "Name", "Url"],

    items: [],

    paging: 5,
    recordsPaging: [5, 10, 20, 50, 100],

    prevLabel: "<< PREV",
    nextLabel: "NEXT >>",

    prevUrl: null,
    nextUrl: null,

    spinner: false,
  }),
  created() {
    this.request();
  },
  methods: {
    request() {
      let page = this.paging;
      console.log(this.paging);
      let api = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${page}`;
      this.axios.get(api).then((response) => {
        console.log(response.data);
        this.items = response.data.results;
        this.nextUrl = response.data.next;
        this.prevUrl = response.data.previous;
      });
    },
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