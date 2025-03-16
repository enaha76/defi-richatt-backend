import { Module } from "@nestjs/common";
import { ActivityModuleBase } from "./base/activity.module.base";
import { ActivityService } from "./activity.service";
import { ActivityController } from "./activity.controller";
import { ActivityResolver } from "./activity.resolver";

@Module({
  imports: [ActivityModuleBase],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityResolver],
  exports: [ActivityService],
})
export class ActivityModule {}
