import { Module } from "@nestjs/common";
import { DefinitionModuleBase } from "./base/definition.module.base";
import { DefinitionService } from "./definition.service";
import { DefinitionController } from "./definition.controller";
import { DefinitionResolver } from "./definition.resolver";

@Module({
  imports: [DefinitionModuleBase],
  controllers: [DefinitionController],
  providers: [DefinitionService, DefinitionResolver],
  exports: [DefinitionService],
})
export class DefinitionModule {}
