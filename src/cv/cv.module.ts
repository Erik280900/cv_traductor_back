import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CvSchema } from './schemas/cv.schema';
import { PdfGeneratorService } from './pdf-generator.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cv', schema: CvSchema }])],
  controllers: [CvController],
  providers: [CvService, PdfGeneratorService],
  exports: [CvService],
})
export class CvModule {}
