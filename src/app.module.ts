import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CvModule } from './cv/cv.module';
import { UploadModule } from './upload/upload.module';
import { TranslateModule } from './translate/translate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    CvModule,
    UploadModule,
    TranslateModule
  ],
})
export class AppModule {}
