const vm = new Vue({
  el: "#app",
  data: {
    people: [],
    page: 0,
    hasNextPage: false,
    produto: []
  },

  methods: {

    showDetaile: function (id, event) {
      console.log(id);
      this.produto = id;
    },

    nextPage: function (event) {
      this.page++;
      this.fetchPeople(this.page);
    },

    fetchPeople() {
      this.hasNextPage = false;
      let url = `https://swapi.co/api/people?page=${this.page}`;
      console.log(url);
      fetch(url)
        .then(response => response.json())
        .then(response => {
          this.getSpecies(response);
        })
    },

    async getSpecies(response) {
      let results = response.results;

      for (index in results) {
        results[index].imageUrl = "./img/star-wars.svg.png";
        if (results[index].species.length > 0) {
          let speciesUrl = results[index].species;
          let name = await this.getSpecieName(speciesUrl, results);
          results[index].species = name
          this.people.push(results[index]);
        } else {
          results[index].species = "Não definido!";
          this.people.push(results[index]);
        }
      }
      this.hasNextPage = response.count >= this.people.length;
      console.log(`Count => ${response.count}`);
      console.log(`Peplo.length => ${this.people.length}`);
    },

    async getSpecieName(speciesUrl) {
      let name;
      await fetch(speciesUrl)
        .then(specie => specie.json())
        .then(specie => {
          name = specie.name;
        });
      return name;
    }
  },

  created() {
    this.page++;
    this.fetchPeople(this.page);
  }
});


