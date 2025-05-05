import axios from 'axios';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;

  _id: string;
  partNumber: string;
  category: string;
  manufacturer: string;
  stock: number;
  dateAdded: string;
  __v?: number;
}

const API_URL = 'http://localhost:3000/parts'; // Adjust to your actual API

/**
 * Fetch products from the API and return them as an array of Product
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await axios.get<Product[]>(API_URL);
    
    // If the API doesn't include the `id`, generate it from index
    const withId = response.data.map((product, index) => ({
      id: index + 1,
      ...product,
    }));

    return withId;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}