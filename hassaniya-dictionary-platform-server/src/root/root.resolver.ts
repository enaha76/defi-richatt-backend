import * as graphql from "@nestjs/graphql";
import { RootResolverBase } from "./base/root.resolver.base";
import { Root } from "./base/Root";
import { RootService } from "./root.service";

@graphql.Resolver(() => Root)
export class RootResolver extends RootResolverBase {
  constructor(protected readonly service: RootService) {
    super(service);
  }
}
