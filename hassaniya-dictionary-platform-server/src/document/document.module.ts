import { Module } from "@nestjs/common";
import { DocumentModuleBase } from "./base/document.module.base";
import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";
import { DocumentResolver } from "./document.resolver";

@Module({
  imports: [DocumentModuleBase],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentResolver],
  exports: [DocumentService],
})
export class DocumentModule {}
