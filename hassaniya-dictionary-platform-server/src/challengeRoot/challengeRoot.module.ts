import { Module } from "@nestjs/common";
import { ChallengeRootModuleBase } from "./base/challengeRoot.module.base";
import { ChallengeRootService } from "./challengeRoot.service";
import { ChallengeRootController } from "./challengeRoot.controller";
import { ChallengeRootResolver } from "./challengeRoot.resolver";

@Module({
  imports: [ChallengeRootModuleBase],
  controllers: [ChallengeRootController],
  providers: [ChallengeRootService, ChallengeRootResolver],
  exports: [ChallengeRootService],
})
export class ChallengeRootModule {}
