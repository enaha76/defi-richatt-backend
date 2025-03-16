import * as graphql from "@nestjs/graphql";
import { SettingResolverBase } from "./base/setting.resolver.base";
import { Setting } from "./base/Setting";
import { SettingService } from "./setting.service";

@graphql.Resolver(() => Setting)
export class SettingResolver extends SettingResolverBase {
  constructor(protected readonly service: SettingService) {
    super(service);
  }
}
