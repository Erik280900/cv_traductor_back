import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CvDocument = HydratedDocument<Cv>;

@Schema()
export class Cv {
  @Prop()
  originalText: string;

  @Prop()
  translatedText: string;

  @Prop()
  filename: string;

  @Prop()
  originalFilename: string;

  @Prop()
  fileUrl: string;

  @Prop()
  translatedFileName: string; // <-- agrega esta línea
}

export const CvSchema = SchemaFactory.createForClass(Cv);
