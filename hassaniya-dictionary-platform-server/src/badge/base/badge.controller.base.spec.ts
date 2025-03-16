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
import { BadgeController } from "../badge.controller";
import { BadgeService } from "../badge.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  badgeName: "exampleBadgeName",
  description: "exampleDescription",
  iconPath: "exampleIconPath",
  id: 42,
  requiredPoints: 42,
  requirementCount: 42,
  requirementType: "exampleRequirementType",
};
const CREATE_RESULT = {
  badgeName: "exampleBadgeName",
  description: "exampleDescription",
  iconPath: "exampleIconPath",
  id: 42,
  requiredPoints: 42,
  requirementCount: 42,
  requirementType: "exampleRequirementType",
};
const FIND_MANY_RESULT = [
  {
    badgeName: "exampleBadgeName",
    description: "exampleDescription",
    iconPath: "exampleIconPath",
    id: 42,
    requiredPoints: 42,
    requirementCount: 42,
    requirementType: "exampleRequirementType",
  },
];
const FIND_ONE_RESULT = {
  badgeName: "exampleBadgeName",
  description: "exampleDescription",
  iconPath: "exampleIconPath",
  id: 42,
  requiredPoints: 42,
  requirementCount: 42,
  requirementType: "exampleRequirementType",
};

const service = {
  createBadge() {
    return CREATE_RESULT;
  },
  badges: () => FIND_MANY_RESULT,
  badge: ({ where }: { where: { id: string } }) => {
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

describe("Badge", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BadgeService,
          useValue: service,
        },
      ],
      controllers: [BadgeController],
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

  test("POST /badges", async () => {
    await request(app.getHttpServer())
      .post("/badges")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_RESULT);
  });

  test("GET /badges", async () => {
    await request(app.getHttpServer())
      .get("/badges")
      .expect(HttpStatus.OK)
      .expect([FIND_MANY_RESULT[0]]);
  });

  test("GET /badges/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/badges"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /badges/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/badges"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect(FIND_ONE_RESULT);
  });

  test("POST /badges existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/badges")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_RESULT)
      .then(function () {
        agent
          .post("/badges")
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
