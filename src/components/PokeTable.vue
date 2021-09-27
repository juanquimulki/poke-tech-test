<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left" v-for="field in fields" :key="field">
              {{ field }}
            </th>
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
</template>

<script>
export default {
  name: "Table",
  props: ["fields", "items"],
  data() {
    return {};
  },
  methods: {},
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
};
</script>