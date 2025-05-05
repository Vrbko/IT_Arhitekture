import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { CartModule } from './modules/cart/cart.module';
import { ProductsModule } from './modules/products/products.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // Import UsersModule

@Module({
  controllers: [AppController], // Add controllers here
  providers: [], // Add providers here (not necessary to add UsersService directly)
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Ensure this path is correct
    }),
    CartModule,
    ProductsModule,
    AuthModule,
    UsersModule, // Add UsersModule to imports
  ],
})
export class AppModule {}