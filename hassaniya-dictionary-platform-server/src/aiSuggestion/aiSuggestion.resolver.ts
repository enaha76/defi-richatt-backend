import * as graphql from "@nestjs/graphql";
import { AiSuggestionResolverBase } from "./base/aiSuggestion.resolver.base";
import { AiSuggestion } from "./base/AiSuggestion";
import { AiSuggestionService } from "./aiSuggestion.service";

@graphql.Resolver(() => AiSuggestion)
export class AiSuggestionResolver extends AiSuggestionResolverBase {
  constructor(protected readonly service: AiSuggestionService) {
    super(service);
  }
}
