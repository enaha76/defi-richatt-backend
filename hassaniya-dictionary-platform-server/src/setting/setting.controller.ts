import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { SettingService } from "./setting.service";
import { SettingControllerBase } from "./base/setting.controller.base";

@swagger.ApiTags("settings")
@common.Controller("settings")
export class SettingController extends SettingControllerBase {
  constructor(protected readonly service: SettingService) {
    super(service);
  }
}
