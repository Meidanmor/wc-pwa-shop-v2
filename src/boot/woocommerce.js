// src/api/woocommerce.js
import { fetchWithToken } from 'src/composables/useApiFetch.js';

const baseURL = 'https://nuxt.meidanm.com/wp-json/wc/store/v1';

const fetchAPI = async (endpoint) => {
  const res = await fetchWithToken(`${baseURL}${endpoint}`, {credentials: 'include'});
  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status}`);
  }
  return res.json();
};

export async function fetchProductById(id) {
  const res = await fetchWithToken(`${baseURL}/products/${id}`, {credentials: 'include'})
  if (!res.ok) throw new Error('Product not found')
  return await res.json()
}

export async function fetchAllProducts() {
  const response = await fetchWithToken(`${baseURL}/products?per_page=100`, {credentials: 'include'});
  const data = await response.json();
  return data;
}


export default {
  getProducts: () => fetchAPI('/products?per_page=100'),
  getProductBySlug: (slug) => fetchAPI(`/products/slug/${slug}`),
  getCategories: () => fetchAPI('/products/categories'),
};
