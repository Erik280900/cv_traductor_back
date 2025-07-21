import { Injectable } from '@nestjs/common';
import { v2 } from '@google-cloud/translate';

@Injectable()
export class TranslateService {
  private translate: v2.Translate;

  constructor() {
    this.translate = new v2.Translate();
  }

  async translateText(text: string, targetLang = 'en'): Promise<string> {
    const [translation] = await this.translate.translate(text, targetLang);
    return translation;
  }
}