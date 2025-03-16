import { Module } from "@nestjs/common";
import { ExampleModuleBase } from "./base/example.module.base";
import { ExampleService } from "./example.service";
import { ExampleController } from "./example.controller";
import { ExampleResolver } from "./example.resolver";

@Module({
  imports: [ExampleModuleBase],
  controllers: [ExampleController],
  providers: [ExampleService, ExampleResolver],
  exports: [ExampleService],
})
export class ExampleModule {}
