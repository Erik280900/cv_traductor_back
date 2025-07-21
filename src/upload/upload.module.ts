import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CvModule } from '../cv/cv.module';
import { TranslateModule } from '../translate/translate.module';

@Module({
  imports: [CvModule, TranslateModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}