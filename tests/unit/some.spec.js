import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'
import PokeInfo from '@/components/PokeInfo.vue'

describe('App', () => {
  // Inspect the raw component options
  it('has data', () => {
    expect(typeof App.data).toBe('function')
  })
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
    expect(wrapper.find("v-card-title").text()).toBe("Info: " + msg);
  });
});
