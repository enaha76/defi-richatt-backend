import { Module } from "@nestjs/common";
import { RootModuleBase } from "./base/root.module.base";
import { RootService } from "./root.service";
import { RootController } from "./root.controller";
import { RootResolver } from "./root.resolver";

@Module({
  imports: [RootModuleBase],
  controllers: [RootController],
  providers: [RootService, RootResolver],
  exports: [RootService],
})
export class RootModule {}
