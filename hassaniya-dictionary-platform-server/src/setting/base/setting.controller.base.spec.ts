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
import { SettingController } from "../setting.controller";
import { SettingService } from "../setting.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  description: "exampleDescription",
  id: 42,
  settingGroup: "exampleSettingGroup",
  settingName: "exampleSettingName",
  settingValue: "exampleSettingValue",
};
const CREATE_RESULT = {
  description: "exampleDescription",
  id: 42,
  settingGroup: "exampleSettingGroup",
  settingName: "exampleSettingName",
  settingValue: "exampleSettingValue",
};
const FIND_MANY_RESULT = [
  {
    description: "exampleDescription",
    id: 42,
    settingGroup: "exampleSettingGroup",
    settingName: "exampleSettingName",
    settingValue: "exampleSettingValue",
  },
];
const FIND_ONE_RESULT = {
  description: "exampleDescription",
  id: 42,
  settingGroup: "exampleSettingGroup",
  settingName: "exampleSettingName",
  settingValue: "exampleSettingValue",
};

const service = {
  createSetting() {
    return CREATE_RESULT;
  },
  settings: () => FIND_MANY_RESULT,
  setting: ({ where }: { where: { id: string } }) => {
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

describe("Setting", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: SettingService,
          useValue: service,
        },
      ],
      controllers: [SettingController],
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

  test("POST /settings", async () => {
    await request(app.getHttpServer())
      .post("/settings")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_RESULT);
  });

  test("GET /settings", async () => {
    await request(app.getHttpServer())
      .get("/settings")
      .expect(HttpStatus.OK)
      .expect([FIND_MANY_RESULT[0]]);
  });

  test("GET /settings/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/settings"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /settings/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/settings"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect(FIND_ONE_RESULT);
  });

  test("POST /settings existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/settings")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_RESULT)
      .then(function () {
        agent
          .post("/settings")
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
