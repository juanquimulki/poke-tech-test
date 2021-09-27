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
          @details="getInfo"
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

    <PokeInfo
      :dialog="pokeInfo"
      :pokeName="pokeName"
      :pokeTypes="pokeTypes"
      :pokeSprite="pokeSprite"
      :pokeEvolution="pokeEvolution"
      @close="pokeInfo = false"
      @goEvolution="getInfo"
    ></PokeInfo>

    <v-snackbar v-model="snackbar">
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import PokeTable from "./components/PokeTable.vue";
import PokeInfo from "./components/PokeInfo.vue";

export default {
  name: "App",

  components: { PokeTable, PokeInfo },

  data: () => ({
    API_URL: "https://pokeapi.co/api/v2",

    tableFields: ["Id", "Name", "Url", "Actions"],
    items: [],

    paging: 5,
    recordsPaging: [5, 10, 20, 50, 100],

    prevLabel: "<< PREV",
    nextLabel: "NEXT >>",

    prevUrl: null,
    nextUrl: null,

    loading: false,

    pokeInfo: false,
    snackbar: false,
    snackbarText: null,

    pokeName: "",
    pokeSprite: "",
    pokeTypes: [],
    pokeEvolution: [],
  }),
  created() {
    this.request();
  },
  methods: {
    callRequest(api) {
      this.loading = true;
      this.axios.get(api).then((response) => {
        this.items = response.data.results;
        this.nextUrl = response.data.next;
        this.prevUrl = response.data.previous;
        this.loading = false;
      });
    },
    request() {
      let page = this.paging;
      let api = `${this.API_URL}/pokemon?offset=0&limit=${page}`;
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
    getInfo(id) {
      this.pokeInfo = false;

      let api1 = `${this.API_URL}/pokemon/${id}`;
      this.axios.get(api1).then((response) => {
        this.pokeName = response.data.name;
        this.pokeSprite = response.data.sprites.front_default;
        this.pokeTypes = response.data.types;

        let api2 = `${this.API_URL}/evolution-chain/${id}`;
        this.axios
          .get(api2)
          .then((response) => {
            this.pokeEvolution = response.data.chain.evolves_to;
          })
          .catch(() => {
            this.snackbarText = "Error 404: Not Found.";
            this.snackbar = true;
          });

        this.pokeInfo = true;
      });
    },
    goEvolution(value) {
      this.pokeInfo = false;
      let array = value.split("/");
      let id = array[6];
      this.getInfo(id);
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