<template>
  <div class="product-detail container">
    <div class="row">
      <div class="col">
        <img :src="product.urlImage" alt="Produto" class="img-fluid rounded product-image" />
      </div>
      <div class="col">
         <div class="info_container">
          <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-info">
          <p class="description">{{ product.description }}</p>
           <p class="price">R$ {{ product.price }}</p>
            <div class="media">
            </div>
          <div class="card">
            <div class="card-body d-flex flex-wrap justify-content-between">
              <div class="rental-card">
                <p>Diário</p>
                <p class="price">R$ {{ product.dailyRental }}</p>
              </div>
              <div class="rental-card">
                <p>Semanal</p>
                <p class="price">R$ {{ product.weeklyRental }}</p>
              </div>
              <div class="rental-card">
                <p>Quinzenal</p>
                <p class="price">R$ {{ product.biweeklyRental }}</p>
              </div>
              <div class="rental-card">
                <p>Mensal</p>
                <p class="price">R$ {{ product.monthlyRental }}</p>
              </div>
            </div>
          </div>
          <h4 class="info-title">Informações técnicas</h4>
          <p class="technical-info">{{ product.technicalInfo }}</p>
          <button class="btn btn-primary w-100 mt-4" @click="addToCart">Adicionar ao carrinho</button>
        </div>
         </div>
      </div>
    </div>

    <div v-if="snackbarMessage" class="snackbar show">{{ snackbarMessage }}</div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService';
import CartService from '@/services/CartService';
import ProductService from '@/services/ProductService';

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: {},
      cartId: null,
      snackbarMessage: '',
    };
  },
  async created() {
    const productId = this.$route.params.id;
    this.product = await ProductService.getProductById(productId);
  },
  methods: {
    async addToCart() {
      if (!AuthService.isLoggedIn(this.$router)) {
        this.$router.push({ name: 'LoginPage' });
        return;
      }

      try {
        const user = await AuthService.getUser(this.$router);
        const cartResponse = await CartService.getCart(user.id);

        if (cartResponse.success) {
          this.cartId = cartResponse.data.id;
        } else {
          const newCart = await CartService.createCart(user.id);
          this.cartId = newCart.data.id;
        }
      } catch (error) {
        this.$router.push({ name: 'LoginPage' });
      }

      if (!this.cartId) {
        this.snackbarMessage = 'Carrinho não encontrado. Tente novamente!';
        this.showSnackbar();
        return;
      }

      try {
        await CartService.addProductToCart(this.cartId, this.product.id, 1);
        this.snackbarMessage = 'Produto adicionado ao carrinho!';
        this.showSnackbar();
      } catch (error) {
        this.snackbarMessage = 'Erro ao adicionar produto ao carrinho. Tente novamente!';
        this.showSnackbar();
      }
    },
    showSnackbar() {
      setTimeout(() => {
        this.snackbarMessage = '';
      }, 3000);
    },
  },
};
</script>

<style scoped>
.product-detail {
  padding: 80px;
}

.col {
  flex: 1 1;
}

.row {
  display: flex;
  flex-wrap: wrap; 
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }
}

.product-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff8c00;
  margin-bottom: 16px;
}

.product-image {
  padding: 0 !important;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.info_container{
  object-fit: cover;
  border-radius: 12px;
}

.product-name:hover,
.description:hover,
.price:hover,
.technical-info:hover {
  color: #ff8c00;
}

.description {
  font-size: 1rem;
  margin: 15px 0;
  color: #000000;
}

.info-title {
  font-size: 1rem;
  color: #333;
  padding-top: 8px;
}

.technical-info {
  margin: 2px 0;
  color: #666;
  font-style: italic;
}

.rental-card-container {
  border: 1px solid #ff8c00; 
  border-radius: 8px; 
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.price {
  font-size: 1.8rem;
  color: #ff8c00;
  font-weight: bold;
  margin-top: 20px;
}

.rental-card:hover {
  transform: scale(1.05);
}

.rental-card p {
  margin: 0;
  color: #333;
}

.btn-primary {
  background-color: #ff8c00;
  border: none;
}

.btn-primary:hover {
  background-color: #e07b00;
}

.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff8c00;
  color: white;
  padding: 16px;
  border-radius: 5px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.snackbar.show {
  visibility: visible;
  opacity: 1;
}
</style>
