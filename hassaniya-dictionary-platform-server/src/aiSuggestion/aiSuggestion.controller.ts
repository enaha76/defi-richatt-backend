import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { AiSuggestionService } from "./aiSuggestion.service";
import { AiSuggestionControllerBase } from "./base/aiSuggestion.controller.base";

@swagger.ApiTags("aiSuggestions")
@common.Controller("aiSuggestions")
export class AiSuggestionController extends AiSuggestionControllerBase {
  constructor(protected readonly service: AiSuggestionService) {
    super(service);
  }
}
