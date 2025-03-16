import { Module } from "@nestjs/common";
import { UserRoleModuleBase } from "./base/userRole.module.base";
import { UserRoleService } from "./userRole.service";
import { UserRoleController } from "./userRole.controller";
import { UserRoleResolver } from "./userRole.resolver";

@Module({
  imports: [UserRoleModuleBase],
  controllers: [UserRoleController],
  providers: [UserRoleService, UserRoleResolver],
  exports: [UserRoleService],
})
export class UserRoleModule {}
