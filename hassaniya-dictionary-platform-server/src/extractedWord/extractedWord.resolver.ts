import * as graphql from "@nestjs/graphql";
import { ExtractedWordResolverBase } from "./base/extractedWord.resolver.base";
import { ExtractedWord } from "./base/ExtractedWord";
import { ExtractedWordService } from "./extractedWord.service";

@graphql.Resolver(() => ExtractedWord)
export class ExtractedWordResolver extends ExtractedWordResolverBase {
  constructor(protected readonly service: ExtractedWordService) {
    super(service);
  }
}
