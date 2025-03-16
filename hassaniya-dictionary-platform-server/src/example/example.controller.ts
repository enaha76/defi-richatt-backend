import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { ExampleService } from "./example.service";
import { ExampleControllerBase } from "./base/example.controller.base";

@swagger.ApiTags("examples")
@common.Controller("examples")
export class ExampleController extends ExampleControllerBase {
  constructor(protected readonly service: ExampleService) {
    super(service);
  }
}
