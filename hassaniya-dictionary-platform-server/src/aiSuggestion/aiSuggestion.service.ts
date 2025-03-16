import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiSuggestionServiceBase } from "./base/aiSuggestion.service.base";

@Injectable()
export class AiSuggestionService extends AiSuggestionServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
