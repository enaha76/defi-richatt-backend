import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DictionaryEntryServiceBase } from "./base/dictionaryEntry.service.base";

@Injectable()
export class DictionaryEntryService extends DictionaryEntryServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
