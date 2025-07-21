import { Controller, Get, Param, Res, NotFoundException, Post } from '@nestjs/common';
import { Response } from 'express';
import { CvService } from './cv.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('cv')
export class CvController {
    constructor(private readonly cvService: CvService) { }

    @Get(':id')
    async getCvOriginal(@Param('id') id: string) {
        const cv = await this.cvService.findById(id);
        if (!cv) throw new NotFoundException('CV no encontrado');
        return {
            filename: cv.filename,
            originalText: cv.originalText,
        };
    }

    @Post(':id/translate')
    async translateCv(@Param('id') id: string) {
    const cv = await this.cvService.translateCv(id);
    return { translatedFileName: cv.translatedFileName };
    }

    @Get(':id/translated')
    async getCvTranslated(@Param('id') id: string) {
        const cv = await this.cvService.findById(id);
        if (!cv) throw new NotFoundException('CV no encontrado');
        return {
            filename: cv.filename,
            translatedText: cv.translatedText,
        };
    }

    @Get(':id/download')
    async downloadOriginalPdf(@Param('id') id: string, @Res() res: Response) {
        const cv = await this.cvService.findById(id);
        if (!cv || !cv.filename) {
            throw new NotFoundException('CV o archivo no encontrado');
        }

        const filePath = path.join(__dirname, '..', '..', 'uploads', cv.filename);
        console.log('Buscando archivo:', filePath);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('Archivo no encontrado en el disco');
        }

        return res.sendFile(filePath);
    }

    @Get(':id/original/download')
    async downloadOriginal(@Param('id') id: string, @Res() res: Response) {
        const pdfPath = await this.cvService.getOriginalPdfPath(id);
        if (!fs.existsSync(pdfPath)) {
            throw new NotFoundException('Archivo original no encontrado');
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=original.pdf');
        fs.createReadStream(pdfPath).pipe(res);
    }

    @Get(':id/translated/download')
    async downloadTranslatedCv(@Param('id') id: string, @Res() res: any) {
    const cv = await this.cvService.findById(id);
    if (!cv || !cv.translatedFileName) {
        throw new NotFoundException('CV traducido no encontrado');
    }

    const filePath = path.resolve(`uploads/${cv.translatedFileName}`);
    if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Archivo traducido no encontrado');
    }

    return res.download(filePath);
    }
}