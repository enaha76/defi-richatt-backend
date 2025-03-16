import { Module } from "@nestjs/common";
import { SettingModuleBase } from "./base/setting.module.base";
import { SettingService } from "./setting.service";
import { SettingController } from "./setting.controller";
import { SettingResolver } from "./setting.resolver";

@Module({
  imports: [SettingModuleBase],
  controllers: [SettingController],
  providers: [SettingService, SettingResolver],
  exports: [SettingService],
})
export class SettingModule {}
