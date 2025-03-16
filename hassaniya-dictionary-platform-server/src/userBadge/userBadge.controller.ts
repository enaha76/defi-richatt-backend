import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { UserBadgeService } from "./userBadge.service";
import { UserBadgeControllerBase } from "./base/userBadge.controller.base";

@swagger.ApiTags("userBadges")
@common.Controller("userBadges")
export class UserBadgeController extends UserBadgeControllerBase {
  constructor(protected readonly service: UserBadgeService) {
    super(service);
  }
}
