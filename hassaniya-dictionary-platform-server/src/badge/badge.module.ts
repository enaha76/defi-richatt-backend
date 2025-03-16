import { Module } from "@nestjs/common";
import { BadgeModuleBase } from "./base/badge.module.base";
import { BadgeService } from "./badge.service";
import { BadgeController } from "./badge.controller";
import { BadgeResolver } from "./badge.resolver";

@Module({
  imports: [BadgeModuleBase],
  controllers: [BadgeController],
  providers: [BadgeService, BadgeResolver],
  exports: [BadgeService],
})
export class BadgeModule {}
