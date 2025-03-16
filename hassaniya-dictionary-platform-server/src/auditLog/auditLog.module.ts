import { Module } from "@nestjs/common";
import { AuditLogModuleBase } from "./base/auditLog.module.base";
import { AuditLogService } from "./auditLog.service";
import { AuditLogController } from "./auditLog.controller";
import { AuditLogResolver } from "./auditLog.resolver";

@Module({
  imports: [AuditLogModuleBase],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogResolver],
  exports: [AuditLogService],
})
export class AuditLogModule {}
