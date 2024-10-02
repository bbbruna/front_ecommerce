import axios from 'axios';

const CartService = {
    async getCart(userId) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            return { success: false, message: 'Token não encontrado. Faça login novamente.' };
        }

        try {
            const response = await axios.get(`/cart/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                const items = response.data.items || []; 

                return {
                    success: true,
                    data: {
                        id: response.data.id,
                        items: items,
                        status: response.data.status,
                        totalQuantity: response.data.totalQuantity || 0 
                    }
                };
            }

            return { success: false, message: 'Resposta inesperada da API.', data: {} };
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    return { success: false, message: 'Erro: Recurso não encontrado (404).' };
                } else {
                    return { success: false, message: 'Erro ao acessar a API: ' + error.response.data };
                }
            } else {
                return { success: false, message: 'Erro ao fazer a requisição: ' + error.message };
            }
        }
    },


    async ensureCartExists(userId) {
        const responseCart = await this.getCart(userId);

        if (!responseCart.success || (responseCart.data && responseCart.data.status !== 'ACTIVE')) {
            const response = await this.createCart(userId);
            return {
                success: true,
                data: {
                    id: response.data.id,
                    items: response.data.items,
                    status: response.data.status,
                    totalQuantity: response.data.totalQuantity
                }
            };
        }

        return responseCart;
    },

    async createCart(userId) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            this.$router.push({ name: 'LoginPage' });
        }

        try {
            const response = await axios.post(`/cart/create/${userId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return { message: 'Erro ao criar o carrinho: ' + error.message };
        }
    },

    async addProductToCart(cartId, productId, quantity) {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            this.$router.push({ name: 'LoginPage' });
            return; 
        }
    
        try {
            const response = await axios.post(`/cart/${cartId}/items/${productId}?quantity=${quantity}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
   
            if (response.status === 204) {
                console.log('Produto adicionado ao carrinho com sucesso!');
                return true; 
            }
    
            throw new Error('Erro inesperado ao adicionar produto ao carrinho.');
        } catch (error) {
            if (error.response) {
                throw new Error('Erro ao adicionar produto ao carrinho: ' + error.message);
            } else {
                throw new Error('Erro ao fazer a requisição: ' + error.message);
            }
        }
    },

    async removeProductFromCart(cartId, productId) {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            this.$router.push({ name: 'LoginPage' });
            return;
        }
    
        try {
            console.log(cartId)
            console.log(productId)
            const response = await axios.delete(`/cart/${cartId}/items/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 204) {
                return { success: true };
            }
    
            throw new Error('Erro ao remover produto do carrinho.');
        } catch (error) {
            if (error.response) {
                throw new Error('Erro ao remover produto do carrinho: ' + error.response.data.message);
            } else {
                throw new Error('Erro ao fazer a requisição: ' + error.message);
            }
        }
    },

    async updateProductQuantity(cartId, productId, quantity) {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            this.$router.push({ name: 'LoginPage' });
            return;
        }

        try {
            const response = await axios.put(`/cart/${cartId}/items/${productId}`, {quantity}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
           
            return response;
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            throw error;
        }
    },

    async removeAllProductsFromCart(cartId, productId) {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            this.$router.push({ name: 'LoginPage' });
            return;
        }

        const response = await axios.delete(`/cart/${cartId}/items/all/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return response.data;
    }
};

export default CartService;
