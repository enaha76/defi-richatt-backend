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
import { UserBadgeController } from "../userBadge.controller";
import { UserBadgeService } from "../userBadge.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  earnedAt: new Date(),
  id: 42,
};
const CREATE_RESULT = {
  earnedAt: new Date(),
  id: 42,
};
const FIND_MANY_RESULT = [
  {
    earnedAt: new Date(),
    id: 42,
  },
];
const FIND_ONE_RESULT = {
  earnedAt: new Date(),
  id: 42,
};

const service = {
  createUserBadge() {
    return CREATE_RESULT;
  },
  userBadges: () => FIND_MANY_RESULT,
  userBadge: ({ where }: { where: { id: string } }) => {
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

describe("UserBadge", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserBadgeService,
          useValue: service,
        },
      ],
      controllers: [UserBadgeController],
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

  test("POST /userBadges", async () => {
    await request(app.getHttpServer())
      .post("/userBadges")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        earnedAt: CREATE_RESULT.earnedAt.toISOString(),
      });
  });

  test("GET /userBadges", async () => {
    await request(app.getHttpServer())
      .get("/userBadges")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          earnedAt: FIND_MANY_RESULT[0].earnedAt.toISOString(),
        },
      ]);
  });

  test("GET /userBadges/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/userBadges"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /userBadges/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/userBadges"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        earnedAt: FIND_ONE_RESULT.earnedAt.toISOString(),
      });
  });

  test("POST /userBadges existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/userBadges")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        earnedAt: CREATE_RESULT.earnedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/userBadges")
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
