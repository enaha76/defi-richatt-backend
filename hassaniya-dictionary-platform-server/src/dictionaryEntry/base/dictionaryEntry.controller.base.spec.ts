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
import { DictionaryEntryController } from "../dictionaryEntry.controller";
import { DictionaryEntryService } from "../dictionaryEntry.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  approvalDate: new Date(),
  audioFilePath: "exampleAudioFilePath",
  createdAt: new Date(),
  id: 42,
  isChallengeWord: "true",
  originType: "exampleOriginType",
  partOfSpeech: "examplePartOfSpeech",
  status: "exampleStatus",
  transliteration: "exampleTransliteration",
  updatedAt: new Date(),
  verbForm: "exampleVerbForm",
  word: "exampleWord",
};
const CREATE_RESULT = {
  approvalDate: new Date(),
  audioFilePath: "exampleAudioFilePath",
  createdAt: new Date(),
  id: 42,
  isChallengeWord: "true",
  originType: "exampleOriginType",
  partOfSpeech: "examplePartOfSpeech",
  status: "exampleStatus",
  transliteration: "exampleTransliteration",
  updatedAt: new Date(),
  verbForm: "exampleVerbForm",
  word: "exampleWord",
};
const FIND_MANY_RESULT = [
  {
    approvalDate: new Date(),
    audioFilePath: "exampleAudioFilePath",
    createdAt: new Date(),
    id: 42,
    isChallengeWord: "true",
    originType: "exampleOriginType",
    partOfSpeech: "examplePartOfSpeech",
    status: "exampleStatus",
    transliteration: "exampleTransliteration",
    updatedAt: new Date(),
    verbForm: "exampleVerbForm",
    word: "exampleWord",
  },
];
const FIND_ONE_RESULT = {
  approvalDate: new Date(),
  audioFilePath: "exampleAudioFilePath",
  createdAt: new Date(),
  id: 42,
  isChallengeWord: "true",
  originType: "exampleOriginType",
  partOfSpeech: "examplePartOfSpeech",
  status: "exampleStatus",
  transliteration: "exampleTransliteration",
  updatedAt: new Date(),
  verbForm: "exampleVerbForm",
  word: "exampleWord",
};

const service = {
  createDictionaryEntry() {
    return CREATE_RESULT;
  },
  dictionaryEntries: () => FIND_MANY_RESULT,
  dictionaryEntry: ({ where }: { where: { id: string } }) => {
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

describe("DictionaryEntry", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DictionaryEntryService,
          useValue: service,
        },
      ],
      controllers: [DictionaryEntryController],
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

  test("POST /dictionaryEntries", async () => {
    await request(app.getHttpServer())
      .post("/dictionaryEntries")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        approvalDate: CREATE_RESULT.approvalDate.toISOString(),
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      });
  });

  test("GET /dictionaryEntries", async () => {
    await request(app.getHttpServer())
      .get("/dictionaryEntries")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          approvalDate: FIND_MANY_RESULT[0].approvalDate.toISOString(),
          createdAt: FIND_MANY_RESULT[0].createdAt.toISOString(),
          updatedAt: FIND_MANY_RESULT[0].updatedAt.toISOString(),
        },
      ]);
  });

  test("GET /dictionaryEntries/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/dictionaryEntries"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /dictionaryEntries/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/dictionaryEntries"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        approvalDate: FIND_ONE_RESULT.approvalDate.toISOString(),
        createdAt: FIND_ONE_RESULT.createdAt.toISOString(),
        updatedAt: FIND_ONE_RESULT.updatedAt.toISOString(),
      });
  });

  test("POST /dictionaryEntries existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/dictionaryEntries")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        approvalDate: CREATE_RESULT.approvalDate.toISOString(),
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/dictionaryEntries")
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
