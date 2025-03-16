import { Module } from "@nestjs/common";
import { AiSuggestionModuleBase } from "./base/aiSuggestion.module.base";
import { AiSuggestionService } from "./aiSuggestion.service";
import { AiSuggestionController } from "./aiSuggestion.controller";
import { AiSuggestionResolver } from "./aiSuggestion.resolver";

@Module({
  imports: [AiSuggestionModuleBase],
  controllers: [AiSuggestionController],
  providers: [AiSuggestionService, AiSuggestionResolver],
  exports: [AiSuggestionService],
})
export class AiSuggestionModule {}
