import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'
import PokeInfo from '@/components/PokeInfo.vue'
import PokeTable from '@/components/PokeTable.vue'

describe('App', () => {
  // Inspect the raw component options
  it('App has data', () => {
    expect(typeof App.data).toBe('function')
  })

  // it("Request should show error message with certain high ID", () => {
  //   const wrapper = shallowMount(App);
  //   let id = "1000";
  //   expect(wrapper.vm.snackbar).toBe(false); // snackbar is hidden
  //   wrapper.vm.getInfo(id);  // calling component method
  //   expect(wrapper.vm.snackbar).toBe(true); // result should be the snackbar
  // });  
})

describe("PokeInfo.vue", () => {
  it("Dialog Title should render what is passed into the props", () => {
    const msg = "PokemonName";
    const wrapper = shallowMount(PokeInfo, {
      propsData: {
        pokeName: msg,
        pokeTypes: [],
        pokeSprite: "",
        pokeEvolution: [],
        dialog: true        
      }
    });
    expect(wrapper.find('[data-testid="pokemon-title"]').text()).toBe("Info: " + msg);
  });
});

describe("PokeTable.vue", () => {
  const wrapper = shallowMount(PokeTable);

  it("Method should return an ID number", () => {
    let url = "https://pokeapi.co/api/v2/pokemon/10";
    let result = parseInt(wrapper.vm.getIdFromUrl(url));  // calling component method
    expect(typeof result).toBe('number'); // result should be a number
    expect(result).toBe(10); // result should be = 10
  });
});
