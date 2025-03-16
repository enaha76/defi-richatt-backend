import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import request from "supertest";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { UserRoleController } from "../userRole.controller";
import { UserRoleService } from "../userRole.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  assignedAt: new Date(),
  id: 42,
};
const CREATE_RESULT = {
  assignedAt: new Date(),
  id: 42,
};
const FIND_MANY_RESULT = [
  {
    assignedAt: new Date(),
    id: 42,
  },
];
const FIND_ONE_RESULT = {
  assignedAt: new Date(),
  id: 42,
};

const service = {
  createUserRole() {
    return CREATE_RESULT;
  },
  userRoles: () => FIND_MANY_RESULT,
  userRole: ({ where }: { where: { id: string } }) => {
    switch (where.id) {
      case existingId:
        return FIND_ONE_RESULT;
      case nonExistingId:
        return null;
    }
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => {
    return true;
  },
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  },
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  },
};

describe("UserRole", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserRoleService,
          useValue: service,
        },
      ],
      controllers: [UserRoleController],
      imports: [ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /userRoles", async () => {
    await request(app.getHttpServer())
      .post("/userRoles")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        assignedAt: CREATE_RESULT.assignedAt.toISOString(),
      });
  });

  test("GET /userRoles", async () => {
    await request(app.getHttpServer())
      .get("/userRoles")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          assignedAt: FIND_MANY_RESULT[0].assignedAt.toISOString(),
        },
      ]);
  });

  test("GET /userRoles/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/userRoles"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /userRoles/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/userRoles"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        assignedAt: FIND_ONE_RESULT.assignedAt.toISOString(),
      });
  });

  test("POST /userRoles existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/userRoles")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        assignedAt: CREATE_RESULT.assignedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/userRoles")
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT,
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
