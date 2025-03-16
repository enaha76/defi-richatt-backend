import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { ExtractedWordService } from "./extractedWord.service";
import { ExtractedWordControllerBase } from "./base/extractedWord.controller.base";

@swagger.ApiTags("extractedWords")
@common.Controller("extractedWords")
export class ExtractedWordController extends ExtractedWordControllerBase {
  constructor(protected readonly service: ExtractedWordService) {
    super(service);
  }
}
