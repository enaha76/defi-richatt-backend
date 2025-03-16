import { Module } from "@nestjs/common";
import { DictionaryEntryModuleBase } from "./base/dictionaryEntry.module.base";
import { DictionaryEntryService } from "./dictionaryEntry.service";
import { DictionaryEntryController } from "./dictionaryEntry.controller";
import { DictionaryEntryResolver } from "./dictionaryEntry.resolver";

@Module({
  imports: [DictionaryEntryModuleBase],
  controllers: [DictionaryEntryController],
  providers: [DictionaryEntryService, DictionaryEntryResolver],
  exports: [DictionaryEntryService],
})
export class DictionaryEntryModule {}
