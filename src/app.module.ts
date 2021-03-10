import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { MONGO_CONNECTION } from './config/config';
import { GetUserMiddleware } from './middlewares/get-user.middleware';
import { ImageController } from './modules/image/image.controller';
import { ImageModule } from './modules/image/image.module';
import { RoleController } from './modules/role/role.controller';
import { RoleModule } from './modules/role/role.module';
import { FirebaseService } from './services/firebase.service';
import { UserModule } from './modules/user/user.module';
import { UserController } from './modules/user/user.controller';
import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    ImageModule,
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [FirebaseService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes(
        ImageController,
        RoleController,
        UserController,
        AuthController,
      );
  }
}
