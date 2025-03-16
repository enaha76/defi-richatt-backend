import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DefinitionServiceBase } from "./base/definition.service.base";

@Injectable()
export class DefinitionService extends DefinitionServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
