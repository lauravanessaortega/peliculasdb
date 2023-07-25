     Vue.config.devtools = false; // Deshabilitamos las herramientas de desarrollo para producción

new Vue({
  el: '#app',
  data: {
    apiKey: 'c0b041832966953acdf433a9b02003f5',
    apiBaseUrl: 'https://api.themoviedb.org/3',
    searchQuery: '',
    movies: [],
    currentPage: 1,
    totalPages: 20, // Ajustamos a 20 páginas para obtener más resultados
    pageSize: 3 // Número de películas aleatorias a mostrar
  },
  methods: {
    async getRandomMovies() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/discover/movie?api_key=${this.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${this.currentPage}`);
        const data = await response.json();
        this.movies = this.shuffleArray(data.results).slice(0, this.pageSize);
      } catch (error) {
        console.error('Error al obtener las películas:', error);
      }
    },
    async searchMovies() {
      try {
        if (this.searchQuery) {
          const response = await fetch(`${this.apiBaseUrl}/search/movie?api_key=${this.apiKey}&language=en-US&query=${this.searchQuery}`);
          const data = await response.json();
          this.movies = data.results;
          this.totalPages = data.total_pages;
        } else {
          // Si no hay término de búsqueda, volvemos a cargar las películas aleatorias
          this.getRandomMovies();
        }
      } catch (error) {
        console.error('Error al buscar las películas:', error);
      }
    },
    getImageUrl(posterPath) {
      return `https://image.tmdb.org/t/p/w500/${posterPath}`;
    },
    goToPage(page) {
      this.currentPage = page;
      this.searchMovies();
    },
    shuffleArray(array) {
      // Algoritmo Fisher-Yates para mezclar el array
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  },
  computed: {
    filteredMovies() {
      return this.movies;
    }
  },
  mounted() {
    this.getRandomMovies();
    // Inicializar el slider después de obtener las películas
    this.$nextTick(() => {
      new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 5000,
        },
      });
    });
  }
});
