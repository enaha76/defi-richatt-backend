import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SettingServiceBase } from "./base/setting.service.base";

@Injectable()
export class SettingService extends SettingServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
