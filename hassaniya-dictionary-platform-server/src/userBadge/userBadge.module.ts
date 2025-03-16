import { Module } from "@nestjs/common";
import { UserBadgeModuleBase } from "./base/userBadge.module.base";
import { UserBadgeService } from "./userBadge.service";
import { UserBadgeController } from "./userBadge.controller";
import { UserBadgeResolver } from "./userBadge.resolver";

@Module({
  imports: [UserBadgeModuleBase],
  controllers: [UserBadgeController],
  providers: [UserBadgeService, UserBadgeResolver],
  exports: [UserBadgeService],
})
export class UserBadgeModule {}
