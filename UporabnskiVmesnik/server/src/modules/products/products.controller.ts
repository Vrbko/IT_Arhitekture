import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { fetchProducts, Product } from '../../products';  // Adjust the path if needed

@Controller('products')
export class ProductsController {
  constructor() {}

  @Get()
  async index(): Promise<Product[]> {
    // Fetch the products dynamically from the API
    const products = await fetchProducts();
    return products;
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<Product> {
    // Fetch the products dynamically from the API
    const products = await fetchProducts();
    
    // Find the product by its ID
    const product = products.find((product) => product.id === parseInt(id));
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}