import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { BadgeService } from "./badge.service";
import { BadgeControllerBase } from "./base/badge.controller.base";

@swagger.ApiTags("badges")
@common.Controller("badges")
export class BadgeController extends BadgeControllerBase {
  constructor(protected readonly service: BadgeService) {
    super(service);
  }
}
