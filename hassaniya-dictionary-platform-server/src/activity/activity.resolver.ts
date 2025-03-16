import * as graphql from "@nestjs/graphql";
import { ActivityResolverBase } from "./base/activity.resolver.base";
import { Activity } from "./base/Activity";
import { ActivityService } from "./activity.service";

@graphql.Resolver(() => Activity)
export class ActivityResolver extends ActivityResolverBase {
  constructor(protected readonly service: ActivityService) {
    super(service);
  }
}
