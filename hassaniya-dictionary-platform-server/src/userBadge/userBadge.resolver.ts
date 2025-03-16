import * as graphql from "@nestjs/graphql";
import { UserBadgeResolverBase } from "./base/userBadge.resolver.base";
import { UserBadge } from "./base/UserBadge";
import { UserBadgeService } from "./userBadge.service";

@graphql.Resolver(() => UserBadge)
export class UserBadgeResolver extends UserBadgeResolverBase {
  constructor(protected readonly service: UserBadgeService) {
    super(service);
  }
}
