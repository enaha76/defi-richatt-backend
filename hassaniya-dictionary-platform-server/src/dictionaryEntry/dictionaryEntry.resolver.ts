import * as graphql from "@nestjs/graphql";
import { DictionaryEntryResolverBase } from "./base/dictionaryEntry.resolver.base";
import { DictionaryEntry } from "./base/DictionaryEntry";
import { DictionaryEntryService } from "./dictionaryEntry.service";

@graphql.Resolver(() => DictionaryEntry)
export class DictionaryEntryResolver extends DictionaryEntryResolverBase {
  constructor(protected readonly service: DictionaryEntryService) {
    super(service);
  }
}
