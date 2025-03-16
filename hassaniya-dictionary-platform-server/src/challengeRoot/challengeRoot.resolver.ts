import * as graphql from "@nestjs/graphql";
import { ChallengeRootResolverBase } from "./base/challengeRoot.resolver.base";
import { ChallengeRoot } from "./base/ChallengeRoot";
import { ChallengeRootService } from "./challengeRoot.service";

@graphql.Resolver(() => ChallengeRoot)
export class ChallengeRootResolver extends ChallengeRootResolverBase {
  constructor(protected readonly service: ChallengeRootService) {
    super(service);
  }
}
