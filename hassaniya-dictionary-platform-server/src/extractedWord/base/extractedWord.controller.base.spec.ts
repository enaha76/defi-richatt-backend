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
import { ExtractedWordController } from "../extractedWord.controller";
import { ExtractedWordService } from "../extractedWord.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  context: "exampleContext",
  id: 42,
  isNew: "true",
  isProcessed: "true",
  word: "exampleWord",
};
const CREATE_RESULT = {
  context: "exampleContext",
  id: 42,
  isNew: "true",
  isProcessed: "true",
  word: "exampleWord",
};
const FIND_MANY_RESULT = [
  {
    context: "exampleContext",
    id: 42,
    isNew: "true",
    isProcessed: "true",
    word: "exampleWord",
  },
];
const FIND_ONE_RESULT = {
  context: "exampleContext",
  id: 42,
  isNew: "true",
  isProcessed: "true",
  word: "exampleWord",
};

const service = {
  createExtractedWord() {
    return CREATE_RESULT;
  },
  extractedWords: () => FIND_MANY_RESULT,
  extractedWord: ({ where }: { where: { id: string } }) => {
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

describe("ExtractedWord", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ExtractedWordService,
          useValue: service,
        },
      ],
      controllers: [ExtractedWordController],
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

  test("POST /extractedWords", async () => {
    await request(app.getHttpServer())
      .post("/extractedWords")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_RESULT);
  });

  test("GET /extractedWords", async () => {
    await request(app.getHttpServer())
      .get("/extractedWords")
      .expect(HttpStatus.OK)
      .expect([FIND_MANY_RESULT[0]]);
  });

  test("GET /extractedWords/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/extractedWords"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /extractedWords/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/extractedWords"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect(FIND_ONE_RESULT);
  });

  test("POST /extractedWords existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/extractedWords")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect(CREATE_RESULT)
      .then(function () {
        agent
          .post("/extractedWords")
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
