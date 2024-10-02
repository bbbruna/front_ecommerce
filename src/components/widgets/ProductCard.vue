<template>
  <div class="card-container">
    <div class="card shadow-sm product-card" @click="goToProductDetail">
      <img class="card-img-top" :src="product.urlImage" alt="Produto" />
      <div class="card-body p-4">
        <h5 class="fw-bolder product-title">{{ product.name }}</h5>
        <p class="product-description">{{ product.description }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <p class="mb-0 price">R$ {{ product.price.toFixed(2).replace('.', ',') }}</p>
          <button class="btn btn-light btn-sm" @click.stop="handleCartClick">
            <i class="bi bi-cart-fill cart-icon"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService';
import CartService from '@/services/CartService';

export default {
  name: 'ProductCart',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToProductDetail() {
      this.$router.push({ name: 'ProductDetail', params: { id: this.product.id } });
    },
    async handleCartClick() {
      try {
        const user = await AuthService.getUser(this.$router);

        if (!user) {
          console.error('Usuário não encontrado. Redirecionando para Login.');
          this.$router.push({ name: 'LoginPage' });
          return;
        }

        const response = await CartService.ensureCartExists(user.id);
        if (response.success) {
          this.$router.push({ name: 'CarrinhoPage' });
        } else {
          this.$router.push({ name: 'LoginPage' });
        }

      } catch (error) {
        console.error('Erro inesperado ao acessar o carrinho:', error.message);
      }
    },
    showSnackbar() {
      setTimeout(() => {
        this.snackbarMessage = '';
      }, 3000,);
    },
  }
};
</script>

<style scoped>
.card {
  border: none;
  transition: transform 0.2s;
  background-color: #fcfcfc;
  cursor: pointer;
}

.btn-light{
  background-color: #f7f7f7;
  border: none;
}

.btn-light:hover{
  background-color: #ff8c00;
  border: none;
}

.card:hover {
  transform: scale(1.05);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.product-title {
  font-size: 1.3rem;
  font-weight: 400;
  color: #333;
}

.product-description {
  font-size: 1rem;
  color: #8b8b8b;
  margin: 0.5rem 0;
  font-weight: 400;
}

.price {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ff8c00;
  margin-bottom: 28px;
}

.cart-icon {
  margin-top: 28px;
  color: #ff8c00;
  font-size: 1.25rem;
}

.cart-icon:hover {
  color: #f7f7f7;
}
</style>
