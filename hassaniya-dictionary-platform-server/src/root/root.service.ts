import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RootServiceBase } from "./base/root.service.base";

@Injectable()
export class RootService extends RootServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
