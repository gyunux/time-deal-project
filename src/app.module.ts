import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductController } from './products/controller/product.controller';
import { ProductService } from './products/service/product.service';
import { OrderController } from './orders/controller/order.controller';
import { OrderService } from './orders/service/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entity/product.entity';
import { ProductOption } from './products/entity/product-option.entity';
import { Order } from './orders/entity/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'mall',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Product, ProductOption,Order]),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [
    AppController,
    ProductController,
    OrderController],
  providers: [AppService,
    ProductService,
    OrderService
  ],
})
export class AppModule { }
