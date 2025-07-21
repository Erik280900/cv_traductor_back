import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cv, CvDocument } from './schemas/cv.schema';
import { PdfGeneratorService } from './pdf-generator.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { rgb } from 'pdf-lib';
import * as fs from 'fs';


@Injectable()
export class CvService {
    private readonly uploadsPath = path.join(__dirname, '..', '..', 'uploads');

    constructor(
        @InjectModel(Cv.name) private cvModel: Model<CvDocument>,
        private readonly pdfGeneratorService: PdfGeneratorService,
    ) { }

    async generateTranslatedPdf(id: string, translatedText: string): Promise<string> {
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([595, 842]); // Tamaño A4
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        const lineHeight = 18;

        const words = translatedText.split(' ');
        let lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const width = font.widthOfTextAtSize(testLine, fontSize);
            if (width < 500) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);

        let y = 800;
        for (const line of lines) {
            if (y < 50) break; // simple límite de página
            page.drawText(line, {
                x: 50,
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });
            y -= lineHeight;
        }

        const pdfBytes = await pdfDoc.save();
        const translatedPath = path.join(this.uploadsPath, `${id}-translated.pdf`);
        fs.writeFileSync(translatedPath, pdfBytes);

        return translatedPath;
    }

    async createCv(data: Partial<Cv>): Promise<Cv> {
        const newCv = new this.cvModel(data);
        return newCv.save();
    }

    async findById(id: string): Promise<Cv | null> {
        return this.cvModel.findById(id).exec();
    }

    async getOriginalPdfPath(id: string): Promise<string> {
        // Suponiendo que guardas como: uploads/<id>.pdf
        const originalPath = path.join(this.uploadsPath, `${id}.pdf`);
        return originalPath;
    }

    async getTranslatedPdfPath(id: string): Promise<string> {
        // Suponiendo que el PDF traducido se guarda como: uploads/<id>-translated.pdf
        const translatedPath = path.join(this.uploadsPath, `${id}-translated.pdf`);
        return translatedPath;
    }

    async translateCv(id: string): Promise<any> {
        const cv = await this.cvModel.findById(id);
        if (!cv) throw new NotFoundException('CV no encontrado');

        // Aquí deberías tener ya el texto traducido en cv.translatedText
        const outputFileName = `translated-${cv.filename}`;
        await this.pdfGeneratorService.createTranslatedPDF(cv.translatedText, outputFileName);

        cv.translatedFileName = outputFileName;
        await cv.save();

        return cv;
    }
}