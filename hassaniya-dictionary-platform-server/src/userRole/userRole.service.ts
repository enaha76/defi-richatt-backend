import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRoleServiceBase } from "./base/userRole.service.base";

@Injectable()
export class UserRoleService extends UserRoleServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
