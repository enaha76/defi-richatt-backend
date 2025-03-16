import * as graphql from "@nestjs/graphql";
import { BadgeResolverBase } from "./base/badge.resolver.base";
import { Badge } from "./base/Badge";
import { BadgeService } from "./badge.service";

@graphql.Resolver(() => Badge)
export class BadgeResolver extends BadgeResolverBase {
  constructor(protected readonly service: BadgeService) {
    super(service);
  }
}
