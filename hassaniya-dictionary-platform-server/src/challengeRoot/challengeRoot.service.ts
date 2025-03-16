import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ChallengeRootServiceBase } from "./base/challengeRoot.service.base";

@Injectable()
export class ChallengeRootService extends ChallengeRootServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
