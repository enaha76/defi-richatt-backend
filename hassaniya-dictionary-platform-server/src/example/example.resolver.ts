import * as graphql from "@nestjs/graphql";
import { ExampleResolverBase } from "./base/example.resolver.base";
import { Example } from "./base/Example";
import { ExampleService } from "./example.service";

@graphql.Resolver(() => Example)
export class ExampleResolver extends ExampleResolverBase {
  constructor(protected readonly service: ExampleService) {
    super(service);
  }
}
