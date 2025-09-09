import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.prod',
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.DataBaseUrl || process.env.MONGODB_URI, {
      useFindAndModify: false,
    }),
    ProductsModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
