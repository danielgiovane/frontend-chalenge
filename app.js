const vm = new Vue({
  el: "#app",
  data: {
    people: [],
    page: 0,
    hasNextPage: false,
    produto: [],
    species: [],
    person: null,
    showPersonDetaile: false,
    nome: 'daniel'
  },

  methods: {
    showDetaile: function (person, event) {
      this.showPersonDetaile = true;
      this.person = person;
      console.log(person);
    },
    closePesonDetaile: function (event) {
      this.showPersonDetaile = false;
      console.log(this.showPersonDetaile);
    },
    nextPage: function (event) {
      this.page++;
      this.fetchPeople(this.page);
    },

    fetchPeople() {
      this.hasNextPage = false;
      let url = `https://swapi.co/api/people?page=${this.page}`;
      fetch(url)
        .then(response => response.json())
        .then(response => {
          this.hasNextPage = response.next != null;
          this.setSpecieName(response);
        })
    },

    async setSpecieName(response) {
      let results = response.results;
      for (index in results) {
        let person = results[index];
        let spacieName = this.getSpecieName(person);
        person.species = spacieName;
        person.imageUrl = "./img/star-wars.svg.png";
        person.imgUrl = "./img/star_wars1.jpg"
        this.person = person;
        this.people.push(person);
      }
    },

    getSpecieName(person) {
      for (index in this.species) {
        let specieUrl = this.species[index].url;
        if (person.species.length > 0 && person.species[0] == specieUrl) {
          return this.species[index].name;
        }
      }
      return 'Não definido';
    },
    async getSpecies(apiSpeciesUrl) {
      let url = apiSpeciesUrl != null ? apiSpeciesUrl : `https://swapi.co/api/species?page=1`;
      console.log(url);
      await fetch(url)
        .then(response => response.json())
        .then(response => {
          let results = response.results;
          this.species = this.species.concat(results);
          if (response.next != null) {
            this.getSpecies(response.next);
          } else {
            this.page++;
            this.fetchPeople(this.page);
          }
        });
    }
  },

  created() {
    this.getSpecies();
  }
});


