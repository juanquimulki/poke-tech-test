<template>
  <div>
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
              <v-simple-table v-if="pokeEvolution.length > 0">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Species</th>
                      <th class="text-left">Url</th>
                      <th class="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in pokeEvolution" :key="item.species.name">
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
              <div class="no-records" v-else>(no records...)</div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="close"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "PokeInfo",
  props: ["pokeName", "pokeTypes", "pokeSprite", "pokeEvolution", "dialog"],
  methods: {
    close() {
      this.$emit("close");
    },
    goEvolution(value) {
      let array = value.split("/");
      let id = array[6];
      this.$emit("goEvolution",id);
    }
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
.v-card__text {
  margin-top: 15px;
}
.no-records {
  font-weight: bold;
  font-size: 10pt;
}
</style>