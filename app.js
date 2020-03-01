const vm = new Vue({
  el: "#app",
  data: {
    people: [],
    page: 0,
    hasNextPage: false,
    species: [],
    films: [],
    planets: [],
    person: null,
    showPersonDetaile: false,
    isLoading: true
  },

  methods: {
    showDetaile: function (person, event) {
      this.showPersonDetaile = true;
      this.person = person;
    },
    closePesonDetaile: function (event) {
      this.showPersonDetaile = false;
    },
    nextPage: function (event) {
      this.page++;
      this.fetchPeople(this.page);
    },

    fetchPeople() {
      this.isLoading = true;
      this.hasNextPage = false;
      let url = `https://swapi.co/api/people?page=${this.page}`;
      fetch(url)
        .then(response => response.json())
        .then(response => {
          this.hasNextPage = response.next != null;
          this.setSpecieName(response);
          this.isLoading = false;
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
        person = this.setFilmsName(person);
        person = this.setPlanetName(person);
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

    setFilmsName(person) {
      let filmsName = "";
      for (index in this.films) {
        let filmUrl = this.films[index].url;
        for(personFilmIndex in person.films) {
          if(person.films[personFilmIndex] == filmUrl) {
            filmsName = filmsName.concat(`${this.films[index].title}, `);
          }
        }
      }
      person.films = filmsName;
      return person;
    },

    async getSpecies(apiSpeciesUrl) {
      let url = apiSpeciesUrl != null ? apiSpeciesUrl : `https://swapi.co/api/species?page=1`;
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
    },

    async getFilms(urlFilms){
      let url = urlFilms != null ?  urlFilms : `https://swapi.co/api/films`
      await fetch(url)
      .then(response => response.json())
      .then(response => {
        let results = response.results;
        this.films = this.films.concat(results);
        if(response.next != null){
          this.getFilms(response.next);
        }
        this.getSpecies();
      });
    },

    async getPlanets(urlPlanets){
      let url = urlPlanets != null ?  urlPlanets : `https://swapi.co/api/planets`
      await fetch(url)
      .then(response => response.json())
      .then(response => {
        let results = response.results;
        this.planets = this.planets.concat(results);
        if(response.next != null){
          this.getPlanets(response.next);
        } else {
          this.getFilms();
        }
      });
    },

    setPlanetName(person){
      for (index in this.planets){
        if(this.planets[index].url == person.homeworld){
          person.homeworld = this.planets[index].name;
          return person;
        }
      }
      return person;
    }

  },

  created() {
    this.getPlanets();
  }
});

