import * as graphql from "@nestjs/graphql";
import { UserRoleResolverBase } from "./base/userRole.resolver.base";
import { UserRole } from "./base/UserRole";
import { UserRoleService } from "./userRole.service";

@graphql.Resolver(() => UserRole)
export class UserRoleResolver extends UserRoleResolverBase {
  constructor(protected readonly service: UserRoleService) {
    super(service);
  }
}
