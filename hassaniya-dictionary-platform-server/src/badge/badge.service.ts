import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BadgeServiceBase } from "./base/badge.service.base";

@Injectable()
export class BadgeService extends BadgeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
