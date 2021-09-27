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

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Info: {{ pokeName | capitalize }}
        </v-card-title>

        <v-card-text>
          Details
          <v-row>
            <v-col>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Types</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="type in pokeTypes" :key="type.type.name">
                      <td>{{ type.type.name }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col>
              <v-card>
                <v-img :src="pokeSprite" max-width="200"></v-img>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Evolution Chain
              <v-simple-table v-if="evolution.length > 0">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Species</th>
                      <th class="text-left">Url</th>
                      <th class="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in evolution" :key="item.species.name">
                      <td>{{ item.species.name }}</td>
                      <td>{{ item.species.url }}</td>
                      <td>
                        <v-btn small @click="goEvolution(item.species.url)"
                          >Go...</v-btn
                        >
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <div class="no-records" v-else>
                (no records...)
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>    
  </v-app>
</template>

<script>
import PokeTable from "./components/PokeTable.vue";

export default {
  name: "App",

  components: { PokeTable },

  data: () => ({
    tableFields: ["Id", "Name", "Url", "Actions"],

    items: [],

    paging: 5,
    recordsPaging: [5, 10, 20, 50, 100],

    prevLabel: "<< PREV",
    nextLabel: "NEXT >>",

    prevUrl: null,
    nextUrl: null,

    loading: false,

    dialog: false,
    snackbar: false,
    snackbarText: null,

    pokeName: "",
    pokeSprite: "",
    pokeTypes: [],
    evolution: [],
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
    getInfo(id) {
      let api1 = `https://pokeapi.co/api/v2/pokemon/${id}`;
      this.axios.get(api1).then((response) => {
        this.pokeName = response.data.name;
        this.pokeSprite = response.data.sprites.front_default;
        this.pokeTypes = response.data.types;

        let api2 = `https://pokeapi.co/api/v2/evolution-chain/${id}`;
        this.axios.get(api2).then((response) => {
          this.evolution = response.data.chain.evolves_to;
        }).catch(()=>{
          this.snackbarText = "Error 404: Not Found.";
          this.snackbar =  true;
        });

        this.dialog = true;
      });
    },
    goEvolution(value) {
      this.dialog = false;
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
  filters: {
    capitalize(value) {
      const str = value;
      const str2 = str.charAt(0).toUpperCase() + str.slice(1);
      return str2;
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
.v-card__text {
  margin-top: 15px;
}
.no-records {
  font-weight: bold;
  font-size: 10pt;
}
</style>