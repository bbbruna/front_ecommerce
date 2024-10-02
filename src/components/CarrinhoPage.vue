<template>
    <div class="cart-container">
        <div class="title">Carrinho de Compras</div>
        <div v-if="cartItems.length !== 0" class="description">Aqui está os produtos que você selecionou</div>
        <div v-if="cartItems.length === 0">
            <p>Seu carrinho está vazio. Adicione produtos!</p>
            <router-link to="/">Ir para produtos</router-link>
        </div>
        <div v-else>
            <div>
                <router-link to="/"><i class="bi bi-arrow-left"></i> Voltar</router-link>
                <ul class="row cart-items">
                    <li v-for="item in cartItems" :key="item.product.id" class="cart-item">
                        <div class='col-2'>
                            <img class="image img-fluid rounded" :src="item.product.urlImage" alt="Produto" />
                        </div>
                        <div class="col - 6">
                            <div class="item-details">
                                <p class="item-name">{{ item.product.name || 'Nome não disponível' }}</p>
                                <p class="item-quantity">Quantidade: <span class="quantity">{{ item.quantity }}</span>
                                </p>
                                <p class="item-price">Preço: R$ {{ item.product.price !== undefined ?
                                    item.product.price.toFixed(2).replace('.', ',') : 'Preço não disponível' }}</p>
                                <div class="quantity-controls">
                                    <button class="quantity-button" @click="decreaseQuantity(item)">-</button>
                                    <span class="quantity-display">{{ item.quantity }}</span>
                                    <button class="quantity-button" @click="increaseQuantity(item)">+</button>
                                    <button class="remove-button"
                                        @click="removeFromCart(item.product.id)">Remover</button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <p class="total-price">Total: R$ {{ totalPrice.toFixed(2).replace('.', ',') }}</p>
            </div>
        </div>
        <div v-if="snackbarMessage" class="snackbar">{{ snackbarMessage }}</div>
    </div>
</template>

<script>
import CartService from '@/services/CartService';
import AuthService from '@/services/AuthService';

export default {
    data() {
        return {
            cartItems: [],
            isLoggedIn: false,
            snackbarMessage: '',
        };
    },
    computed: {
        totalPrice() {
            return this.cartItems.reduce((total, item) => {
                const price = parseFloat(item.product.price);
                const quantity = parseInt(item.quantity, 10);
                return total + (price * quantity);
            }, 0);
        },
    },
    async created() {
        try {
            const user = await AuthService.getUser(this.router$);

            if (user) {
                const cartResponse = await CartService.getCart(user.id);

                this.cartItems = cartResponse.data.items;

                if (cartResponse && cartResponse.data && Array.isArray(cartResponse.data.items)) {
                    this.cartItems = cartResponse.data.items;
                } else {
                    console.warn('Carrinho vazio ou estrutura inesperada:', cartResponse);
                }
            } else {
                this.router$.push({ name: 'LoginPage' });
            }
        } catch (error) {
            console.error('Erro ao carregar o carrinho:', error);
        }

    },
    methods: {
        async removeFromCart(productId) {
            try {
                const cartItemsToRemove = this.cartItems.filter(item => item.product.id === productId);
                if (cartItemsToRemove.length === 0) {
                    throw new Error('Produto não encontrado no carrinho.');
                }

                const cartId = cartItemsToRemove[0].cartId;

                await CartService.removeAllProductsFromCart(cartId, productId);

                this.cartItems = this.cartItems.filter(item => item.product.id !== productId);

                this.snackbarMessage = 'Todos os itens do produto foram removidos do carrinho!';
                this.showSnackbar();
            } catch (error) {
                this.snackbarMessage = 'Erro ao remover produto do carrinho: ' + error.message;
                this.showSnackbar();
            }
        },

        async decreaseQuantity(item) {
            if (item.quantity > 1) {

                const cartId = item.cartId;
                const productId = item.product.id;

                try {
                    await CartService.updateProductQuantity(cartId, productId, item.quantity - 1);
                    item.quantity--;
                    this.snackbarMessage = 'Quantidade diminuída!';
                    this.showSnackbar();
                } catch (error) {
                    console.error('Erro ao atualizar quantidade:', error.message);
                    this.snackbarMessage = 'Erro ao atualizar quantidade: ' + error.message;
                    this.showSnackbar();
                }
            } else {
                await this.removeFromCart(item.product.id);
            }
        },

        async increaseQuantity(item) {
            const cartId = item.cartId;
            const productId = item.product.id;

            try {

                await CartService.updateProductQuantity(cartId, productId, item.quantity + 1);
                item.quantity++;


                this.snackbarMessage = 'Produto adicionado!';
                this.showSnackbar();
            } catch (error) {
                this.snackbarMessage = 'Erro ao atualizar quantidade: ' + error.message;
                this.showSnackbar();
            }
        },

        showSnackbar() {
            const snackbar = document.querySelector('.snackbar');
            snackbar.classList.add('show');

            setTimeout(() => {
                snackbar.classList.remove('show');
                this.snackbarMessage = '';
            }, 3000);
        }
    }
};
</script>
<style scoped>
.title {
    font-size: 2.5rem;
    color: #ff8c00;
    font-weight: 900;
    margin-bottom: 5px;
}

.description {
    font-size: 1.1rem;
    color: #6e6e6e;
    margin-bottom: 20px;
}

.cart-container {
    padding: 50px 50px 50px 50px;
    display: flex;
    flex-direction: column;
}

.cart-items {
    list-style-type: none;
    padding: 0;
}

.cart-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.item-price {
    font-weight: 500;
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

.image {
    border-radius: 12px;
    margin-right: 20px;
    flex: 1 0 200px;
}

.item-details {
    flex: 1;
    margin-left: 15px;
    font-weight: 400;
}

.item-name {
    font-weight: bold;
    font-size: 1.2rem;
}

.quantity-button {
    background-color: rgb(202, 202, 202);
    border: none;
    color: rgb(255, 255, 255);
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    margin: 5px;
    font-weight: bold;
}

.quantity-display {
    margin: 0 10px;
    font-size: 1.1rem;
    font-weight: 400;
}

.quantity-button:hover {
    background-color: #ff8c00;
}

.remove-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    margin-left: 20px;
    cursor: pointer;
}

.remove-button:hover {
    background-color: #ff0000;
}

.total-price {
    font-size: 1.5rem;
    color: #ff8c00;
    font-weight: bold;
    margin-top: 20px;
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