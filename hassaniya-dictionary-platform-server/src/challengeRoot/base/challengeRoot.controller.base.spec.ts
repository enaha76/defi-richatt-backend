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
import { ChallengeRootController } from "../challengeRoot.controller";
import { ChallengeRootService } from "../challengeRoot.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  currentCount: 42,
  description: "exampleDescription",
  endDate: new Date(),
  id: 42,
  name: "exampleName",
  startDate: new Date(),
  targetCount: 42,
};
const CREATE_RESULT = {
  currentCount: 42,
  description: "exampleDescription",
  endDate: new Date(),
  id: 42,
  name: "exampleName",
  startDate: new Date(),
  targetCount: 42,
};
const FIND_MANY_RESULT = [
  {
    currentCount: 42,
    description: "exampleDescription",
    endDate: new Date(),
    id: 42,
    name: "exampleName",
    startDate: new Date(),
    targetCount: 42,
  },
];
const FIND_ONE_RESULT = {
  currentCount: 42,
  description: "exampleDescription",
  endDate: new Date(),
  id: 42,
  name: "exampleName",
  startDate: new Date(),
  targetCount: 42,
};

const service = {
  createChallengeRoot() {
    return CREATE_RESULT;
  },
  challengeRoots: () => FIND_MANY_RESULT,
  challengeRoot: ({ where }: { where: { id: string } }) => {
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

describe("ChallengeRoot", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ChallengeRootService,
          useValue: service,
        },
      ],
      controllers: [ChallengeRootController],
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

  test("POST /challengeRoots", async () => {
    await request(app.getHttpServer())
      .post("/challengeRoots")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        endDate: CREATE_RESULT.endDate.toISOString(),
        startDate: CREATE_RESULT.startDate.toISOString(),
      });
  });

  test("GET /challengeRoots", async () => {
    await request(app.getHttpServer())
      .get("/challengeRoots")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          endDate: FIND_MANY_RESULT[0].endDate.toISOString(),
          startDate: FIND_MANY_RESULT[0].startDate.toISOString(),
        },
      ]);
  });

  test("GET /challengeRoots/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/challengeRoots"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /challengeRoots/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/challengeRoots"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        endDate: FIND_ONE_RESULT.endDate.toISOString(),
        startDate: FIND_ONE_RESULT.startDate.toISOString(),
      });
  });

  test("POST /challengeRoots existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/challengeRoots")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        endDate: CREATE_RESULT.endDate.toISOString(),
        startDate: CREATE_RESULT.startDate.toISOString(),
      })
      .then(function () {
        agent
          .post("/challengeRoots")
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
