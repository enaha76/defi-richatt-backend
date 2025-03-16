import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { ChallengeRootService } from "./challengeRoot.service";
import { ChallengeRootControllerBase } from "./base/challengeRoot.controller.base";

@swagger.ApiTags("challengeRoots")
@common.Controller("challengeRoots")
export class ChallengeRootController extends ChallengeRootControllerBase {
  constructor(protected readonly service: ChallengeRootService) {
    super(service);
  }
}
