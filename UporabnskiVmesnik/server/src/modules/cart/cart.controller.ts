import {
  Controller,
  Get,
  Request,
  UseGuards,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { fetchProducts, Product } from '../../products'; // Import the async fetchProducts function

interface CartItem extends Product {
  quantity: number;
}

interface Cart {
  cartItems: CartItem[];
}

const initialCart = (indexes: number[], products: Product[]): Cart => ({
  cartItems: indexes.map((index) => ({
    ...products[index],
    quantity: 1,
  })),
});

@Controller('cart')
export class CartController {
  private carts: Record<number, Cart> = {};

  constructor() {}

  // Helper function to get the products dynamically
  private async getProducts(): Promise<Product[]> {
    try {
      const products = await fetchProducts(); // Fetching products dynamically
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(@Request() req): Promise<Cart> {
    // Fetch the products dynamically
    const products = await this.getProducts();
    const userCart = this.carts[req.user.userId] ?? { cartItems: [] };
    return userCart;
  }


@Post('checkout')
@UseGuards(JwtAuthGuard)
async postCart(@Request() req): Promise<{ message: string; response: any }> {
  const userId = req.user.userId;
  const cart = this.carts[userId];
  console.log(JSON.stringify(cart));

  const transformedCartItems = cart.cartItems.map(item => ({
      part_name: item.name,  // Assuming 'name' is the part name
      quantity: item.quantity,  // Assuming 'quantity' is the quantity
      part_no: item.partNumber  // Assuming 'part_no' is the part number
    }));
    console.log(JSON.stringify(transformedCartItems));
  if (!cart || cart.cartItems.length === 0) {
    return {
      message: 'Cart is empty. Cannot complete order.',
      response: null,
    };
  }
  const responses = [];

  try {

    for (const item of transformedCartItems) {
      const apiResponse = await fetch('http://php:8000/API.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      const responseData = await apiResponse.json();
      responses.push(responseData);
    }


    // Clear the cart after posting
    this.carts[userId] = { cartItems: [] };

    return {
      message: 'Order posted to external API and cart cleared.',
      response: responses,
    };
  } catch (error) {
    console.error('Error posting to external API:', error);
    return {
      message: 'Failed to post order to external API.',
      response: null,
    };
  }
}


  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() { id }: { id: string }): Promise<Cart> {
    // Fetch the products dynamically
    const products = await this.getProducts();

    const cart = this.carts[req.user.userId] ?? { cartItems: [] };
    const cartItem = cart.cartItems.find(
      (cartItem) => cartItem.id === parseInt(id),
    );

    // If item already in cart, increase quantity
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      // Otherwise, add the new item to the cart
      const product = products.find((product) => product.id === parseInt(id));
      if (product) {
        cart.cartItems.push({
          ...product,
          quantity: 1,
        });
      }
    }

    // Save the updated cart
    this.carts[req.user.userId] = cart;
    return cart;
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async destroy(@Request() req): Promise<Cart> {
    // Clear the user's cart
    this.carts[req.user.userId] = { cartItems: [] };
    return this.carts[req.user.userId];
  }
}