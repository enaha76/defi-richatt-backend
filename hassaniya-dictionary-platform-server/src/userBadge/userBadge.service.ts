import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserBadgeServiceBase } from "./base/userBadge.service.base";

@Injectable()
export class UserBadgeService extends UserBadgeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
