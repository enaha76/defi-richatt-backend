import * as graphql from "@nestjs/graphql";
import { AuditLogResolverBase } from "./base/auditLog.resolver.base";
import { AuditLog } from "./base/AuditLog";
import { AuditLogService } from "./auditLog.service";

@graphql.Resolver(() => AuditLog)
export class AuditLogResolver extends AuditLogResolverBase {
  constructor(protected readonly service: AuditLogService) {
    super(service);
  }
}
