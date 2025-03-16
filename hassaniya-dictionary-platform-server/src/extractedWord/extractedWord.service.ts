import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ExtractedWordServiceBase } from "./base/extractedWord.service.base";

@Injectable()
export class ExtractedWordService extends ExtractedWordServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
