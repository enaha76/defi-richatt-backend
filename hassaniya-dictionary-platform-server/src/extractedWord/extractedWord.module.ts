import { Module } from "@nestjs/common";
import { ExtractedWordModuleBase } from "./base/extractedWord.module.base";
import { ExtractedWordService } from "./extractedWord.service";
import { ExtractedWordController } from "./extractedWord.controller";
import { ExtractedWordResolver } from "./extractedWord.resolver";

@Module({
  imports: [ExtractedWordModuleBase],
  controllers: [ExtractedWordController],
  providers: [ExtractedWordService, ExtractedWordResolver],
  exports: [ExtractedWordService],
})
export class ExtractedWordModule {}
