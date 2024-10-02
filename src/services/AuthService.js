import axios from './AxiosConfig';

class AuthService {

    async login(email, password) {
        try {
            const response = await axios.post('/login', { email, password });
            const token = response.data; 
            if (token) {
                localStorage.setItem('authToken', token); 
                return token; 
            } else {
                throw new Error('Token não encontrado na resposta.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    }

    isLoggedIn(route = this.$router) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            route.push({ name: 'LoginPage' });
            return false;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));

        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp < currentTime) {
            localStorage.removeItem('authToken');
            console.error('Token expirado. Redirecionando para a tela de login.');
            route.push({ name: 'LoginPage' });
            return false;
        }

        return true;
    }

    logout() {
        localStorage.removeItem('userToken');
    }

    async getUser(route = this.$router) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            route.push({ name: 'LoginPage' });
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));

        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
            console.log(route)
            console.error('Token expirado. Redirecionando para a tela de login.');
            route.push({ name: 'LoginPage' });
            return;
        }

        try {
            const response = await axios.get(`/user/${payload.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Erro ao acessar o usuário:', error.response.data);

                switch (error.response.status) {
                    case 403:
                        console.error('Acesso negado. Verifique suas permissões.');
                        route.push({ name: 'LoginPage' });
                        break;
                    case 404:
                        console.error('Usuário não encontrado. Redirecionando para a tela de login.');
                        route.push({ name: 'LoginPage' });
                        break;
                    default:
                        console.error('Erro inesperado:', error.response.status);
                        break;
                }
            } else {
                console.error('Erro ao fazer a requisição:', error);
            }
            throw error;
        }
    }
   
}

export default new AuthService();
