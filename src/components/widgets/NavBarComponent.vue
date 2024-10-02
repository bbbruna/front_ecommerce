<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Ecommerce</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link clickable" @click="goToProducts">Produtos</a>
          </li>
        </ul>
        <div class="d-flex align-items-center ms-auto">
          <button v-if="isLoggedIn" class="btn btn-danger" @click="logout">
            Deslogar
        </button>
          <a class="nav-link clickable cart-icon" @click="goToLogin" aria-label="Login">
            <i class="bi bi-person" aria-hidden="true"></i>
          </a>
          <a class="nav-link clickable cart-icon" @click="goToCart" aria-label="Carrinho">
            <i class="bi bi-cart" aria-hidden="true"></i> 
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    goToProducts() {
      this.$router.push({ name: 'ProductsList' });
    },
    goToLogin() {
      this.$router.push({ name: 'LoginPage' });
    },
    goToCart() {
      this.$router.push({ name: 'CarrinhoPage' });
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  background-color:#ff8c00;
}

.navbar-nav .nav-link {
  color: #ffffff; 
  cursor: pointer;
  transition: color 0.3s;
  padding: 15px; 
}

.navbar-nav .nav-link:hover {
  color: #db5929;
}

.d-flex .nav-link:hover {
  transform: scale(1.1); 
  color:  #db5929;
  cursor: pointer;
}

.cart-icon {
  font-size: 1.5rem;
  transition: transform 0.3s; 
  color: white
}

.container-fluid {
  padding-left: 80px; 
  padding-right: 80px; 
}

.navbar-brand{
  color: #ffffff;
  font-weight: bold;
}

.navbar-brand:hover{
  color: #db5929;
  font-weight: bold;
}

.d-flex .nav-link {
  margin-left: 20px; 
}
</style>
