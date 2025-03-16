import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { RootService } from "./root.service";
import { RootControllerBase } from "./base/root.controller.base";

@swagger.ApiTags("roots")
@common.Controller("roots")
export class RootController extends RootControllerBase {
  constructor(protected readonly service: RootService) {
    super(service);
  }
}
