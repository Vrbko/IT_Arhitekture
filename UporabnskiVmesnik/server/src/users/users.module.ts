import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',  // Use the same name as you're injecting in the service
        transport: Transport.GRPC,
        options: {
          package: 'user', // Name of your proto package
          protoPath: join(__dirname, '..', '..', 'proto', 'user.proto'),  // Path to your .proto file
          url: 'localhost:50051',  // Make sure this is the correct address

        },
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],  // Ensure that UsersService is exported if needed elsewhere
})
export class UsersModule {}