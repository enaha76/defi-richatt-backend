import * as graphql from "@nestjs/graphql";
import { DefinitionResolverBase } from "./base/definition.resolver.base";
import { Definition } from "./base/Definition";
import { DefinitionService } from "./definition.service";

@graphql.Resolver(() => Definition)
export class DefinitionResolver extends DefinitionResolverBase {
  constructor(protected readonly service: DefinitionService) {
    super(service);
  }
}
