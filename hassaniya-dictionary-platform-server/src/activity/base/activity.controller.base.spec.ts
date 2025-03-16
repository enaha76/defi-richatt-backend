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
import { ActivityController } from "../activity.controller";
import { ActivityService } from "../activity.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  activityDate: new Date(),
  activityType: "exampleActivityType",
  description: "exampleDescription",
  id: 42,
  pointsEarned: 42,
};
const CREATE_RESULT = {
  activityDate: new Date(),
  activityType: "exampleActivityType",
  description: "exampleDescription",
  id: 42,
  pointsEarned: 42,
};
const FIND_MANY_RESULT = [
  {
    activityDate: new Date(),
    activityType: "exampleActivityType",
    description: "exampleDescription",
    id: 42,
    pointsEarned: 42,
  },
];
const FIND_ONE_RESULT = {
  activityDate: new Date(),
  activityType: "exampleActivityType",
  description: "exampleDescription",
  id: 42,
  pointsEarned: 42,
};

const service = {
  createActivity() {
    return CREATE_RESULT;
  },
  activities: () => FIND_MANY_RESULT,
  activity: ({ where }: { where: { id: string } }) => {
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

describe("Activity", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ActivityService,
          useValue: service,
        },
      ],
      controllers: [ActivityController],
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

  test("POST /activities", async () => {
    await request(app.getHttpServer())
      .post("/activities")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        activityDate: CREATE_RESULT.activityDate.toISOString(),
      });
  });

  test("GET /activities", async () => {
    await request(app.getHttpServer())
      .get("/activities")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          activityDate: FIND_MANY_RESULT[0].activityDate.toISOString(),
        },
      ]);
  });

  test("GET /activities/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/activities"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /activities/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/activities"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        activityDate: FIND_ONE_RESULT.activityDate.toISOString(),
      });
  });

  test("POST /activities existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/activities")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        activityDate: CREATE_RESULT.activityDate.toISOString(),
      })
      .then(function () {
        agent
          .post("/activities")
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
