import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import { CvService } from '../cv/cv.service';
import { TranslateService } from '../translate/translate.service';

@Injectable()
export class UploadService {
    constructor(
        private readonly cvService: CvService,
        private readonly translateService: TranslateService,
    ) { }

    async extractTextFromPDF(path: string): Promise<string> {
        const dataBuffer = fs.readFileSync(path);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text;
    }

    async handleUpload(file: Express.Multer.File): Promise<any> {
        const text = await this.extractTextFromPDF(file.path);
        const translated = await this.translateService.translateText(text, 'en');

        const cvData = {
            filename: file.filename,
            fileUrl: file.path,
            originalText: text,
            translatedText: translated
        };

        const saved = await this.cvService.createCv(cvData);
        return saved;
    }
}
