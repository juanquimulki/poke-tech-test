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
          </v-col>
        </v-row>

        <PokeTable
          :fields="tableFields"
          :items="items"
          v-if="!loading"
        ></PokeTable>
        <div class="loading-progress" v-else>
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="red"
          ></v-progress-circular>
        </div>

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

    loading: false,
  }),
  created() {
    this.request();
  },
  methods: {
    callRequest(api) {
      this.loading = true;
      this.axios.get(api).then((response) => {
        console.log(response.data);
        this.items = response.data.results;
        this.nextUrl = response.data.next;
        this.prevUrl = response.data.previous;
        this.loading = false;
      });
    },
    request() {
      let page = this.paging;
      console.log(this.paging);
      let api = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${page}`;
      this.callRequest(api);
    },
    nextPage() {
      let api = this.nextUrl;
      this.callRequest(api);
    },
    prevPage() {
      let api = this.prevUrl;
      this.callRequest(api);
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
.loading-progress {
  margin-bottom: 20px;
  text-align: center;
}
</style>