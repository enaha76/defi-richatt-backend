import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ExampleServiceBase } from "./base/example.service.base";

@Injectable()
export class ExampleService extends ExampleServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
