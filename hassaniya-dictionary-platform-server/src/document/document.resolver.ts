import * as graphql from "@nestjs/graphql";
import { DocumentResolverBase } from "./base/document.resolver.base";
import { Document } from "./base/Document";
import { DocumentService } from "./document.service";

@graphql.Resolver(() => Document)
export class DocumentResolver extends DocumentResolverBase {
  constructor(protected readonly service: DocumentService) {
    super(service);
  }
}
