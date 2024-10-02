import axios from './AxiosConfig';
import Product from '@/data/models/Product'; // Importe seu modelo Product

class ProductService {
  async getProducts() {
    try {
      const response = await axios.get("/products");
      return this.mapProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const response = await axios.get(`/products/${productId}`);
      console.log(this.mapProduct(response.data));
      return this.mapProduct(response.data);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  async getCart() {
    const user = this.getUser();
    if (!user) {
      throw new Error('Usuário não está logado');
    }
    const response = await axios.get(`/api/cart/${user.id}`);
    return response.data; 
  }

 
  mapProducts(items) {
    return items.map(item => this.mapProduct(item));
  }

  mapProduct(item) {
    return new Product(
      item.id,
      item.name,
      item.description,
      item.urlImage,
      item.technicalInfo,
      item.price,
      item.dailyRental,
      item.weeklyRental,
      item.biweeklyRental,
      item.monthlyRental
    );
  }
}

export default new ProductService();
