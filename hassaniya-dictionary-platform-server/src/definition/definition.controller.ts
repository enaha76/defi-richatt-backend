import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { DefinitionService } from "./definition.service";
import { DefinitionControllerBase } from "./base/definition.controller.base";

@swagger.ApiTags("definitions")
@common.Controller("definitions")
export class DefinitionController extends DefinitionControllerBase {
  constructor(protected readonly service: DefinitionService) {
    super(service);
  }
}
