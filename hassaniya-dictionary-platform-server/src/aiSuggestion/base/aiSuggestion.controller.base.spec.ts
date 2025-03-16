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
import { AiSuggestionController } from "../aiSuggestion.controller";
import { AiSuggestionService } from "../aiSuggestion.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  createdAt: new Date(),
  examples: "exampleExamples",
  formType: "exampleFormType",
  id: 42,
  reviewedAt: new Date(),
  status: "exampleStatus",
  suggestedDefinition: "exampleSuggestedDefinition",
  suggestedWord: "exampleSuggestedWord",
};
const CREATE_RESULT = {
  createdAt: new Date(),
  examples: "exampleExamples",
  formType: "exampleFormType",
  id: 42,
  reviewedAt: new Date(),
  status: "exampleStatus",
  suggestedDefinition: "exampleSuggestedDefinition",
  suggestedWord: "exampleSuggestedWord",
};
const FIND_MANY_RESULT = [
  {
    createdAt: new Date(),
    examples: "exampleExamples",
    formType: "exampleFormType",
    id: 42,
    reviewedAt: new Date(),
    status: "exampleStatus",
    suggestedDefinition: "exampleSuggestedDefinition",
    suggestedWord: "exampleSuggestedWord",
  },
];
const FIND_ONE_RESULT = {
  createdAt: new Date(),
  examples: "exampleExamples",
  formType: "exampleFormType",
  id: 42,
  reviewedAt: new Date(),
  status: "exampleStatus",
  suggestedDefinition: "exampleSuggestedDefinition",
  suggestedWord: "exampleSuggestedWord",
};

const service = {
  createAiSuggestion() {
    return CREATE_RESULT;
  },
  aiSuggestions: () => FIND_MANY_RESULT,
  aiSuggestion: ({ where }: { where: { id: string } }) => {
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

describe("AiSuggestion", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: AiSuggestionService,
          useValue: service,
        },
      ],
      controllers: [AiSuggestionController],
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

  test("POST /aiSuggestions", async () => {
    await request(app.getHttpServer())
      .post("/aiSuggestions")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        reviewedAt: CREATE_RESULT.reviewedAt.toISOString(),
      });
  });

  test("GET /aiSuggestions", async () => {
    await request(app.getHttpServer())
      .get("/aiSuggestions")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          reviewedAt: FIND_MANY_RESULT[0].reviewedAt.toISOString(),
        },
      ]);
  });

  test("GET /aiSuggestions/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/aiSuggestions"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /aiSuggestions/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/aiSuggestions"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        reviewedAt: FIND_ONE_RESULT.reviewedAt.toISOString(),
      });
  });

  test("POST /aiSuggestions existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/aiSuggestions")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        reviewedAt: CREATE_RESULT.reviewedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/aiSuggestions")
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
