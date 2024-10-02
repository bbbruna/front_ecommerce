<template>
  <div class="products-list">
    <div class="">
      <div class="header">
        <h2 class="title">Produtos</h2>
        <p class="description">Descubra as soluções de gestão que podem transformar a eficiência e a produtividade da sua empresa.</p>
        <div class="search-container d-flex align-items-center">
        <i class="bi bi-search 2"></i>
        <input type="text" v-model="searchQuery" placeholder="Buscar produtos..." class="form-control search-input" />
      </div>
      </div>
    </div>

    <div v-if="loading" class="loading-indicator">
      <p>Carregando produtos...</p>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="products.length === 0 && !loading">
      <p>Não há produtos disponíveis.</p>
    </div>

    <div v-else class="row">
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="product in filteredProducts" :key="product.id">
    <ProductCard :product="product" />
  </div>

</div>
  </div>
</template>

<script>
import ProductCard from '@/components/widgets/ProductCard.vue';
import ProductService from '@/services/ProductService';

export default {
  name: 'ProductsList',
  components: {
    ProductCard
  },
  data() {
    return {
      products: [],
      searchQuery: '',
      loading: true
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  async created() {
    try {
      this.products = await ProductService.getProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    searchProducts() { }
  }
};
</script>

<style scoped>
.products-list {
  padding: 50px 20px 50px 80px;
}

.row{
  margin-right: 20px;
}

.title {
  font-size: 2.5rem;
  color:#ff8c00;
  font-weight: 900;
  margin-bottom: 5px;
}

.description {
  font-size: 1.1rem;
  color: #6e6e6e;
  margin-bottom: 20px;
}

.search-container {
  flex-grow: 1;
  max-width: 400px;
}

.search-container {
  position: relative;
}

.bi-search {
  font-size: 1.5rem; 
  color: #ff8c00; 
  padding-right: 10px;
}

.search-input:focus {
  border-color: #ff8c00; 
  outline: none; 
}

.search-input {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  outline: none; 
}

.loading-indicator {
  text-align: center;
  margin: 20px 0;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  margin-top: 10px;
}

.row {
  margin-top: 20px;
}
</style>
