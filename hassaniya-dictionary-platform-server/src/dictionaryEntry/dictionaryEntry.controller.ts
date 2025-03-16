import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { DictionaryEntryService } from "./dictionaryEntry.service";
import { DictionaryEntryControllerBase } from "./base/dictionaryEntry.controller.base";

@swagger.ApiTags("dictionaryEntries")
@common.Controller("dictionaryEntries")
export class DictionaryEntryController extends DictionaryEntryControllerBase {
  constructor(protected readonly service: DictionaryEntryService) {
    super(service);
  }
}
