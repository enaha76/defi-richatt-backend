import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { AuditLogService } from "./auditLog.service";
import { AuditLogControllerBase } from "./base/auditLog.controller.base";

@swagger.ApiTags("auditLogs")
@common.Controller("auditLogs")
export class AuditLogController extends AuditLogControllerBase {
  constructor(protected readonly service: AuditLogService) {
    super(service);
  }
}
