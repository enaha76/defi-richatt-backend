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
import { DocumentController } from "../document.controller";
import { DocumentService } from "../document.service";

const nonExistingId = "nonExistingId";
const existingId = "existingId";
const CREATE_INPUT = {
  documentName: "exampleDocumentName",
  documentType: "exampleDocumentType",
  filePath: "exampleFilePath",
  id: 42,
  language: "exampleLanguage",
  newWordCount: 42,
  processingStatus: "exampleProcessingStatus",
  uploadedAt: new Date(),
  wordCount: 42,
};
const CREATE_RESULT = {
  documentName: "exampleDocumentName",
  documentType: "exampleDocumentType",
  filePath: "exampleFilePath",
  id: 42,
  language: "exampleLanguage",
  newWordCount: 42,
  processingStatus: "exampleProcessingStatus",
  uploadedAt: new Date(),
  wordCount: 42,
};
const FIND_MANY_RESULT = [
  {
    documentName: "exampleDocumentName",
    documentType: "exampleDocumentType",
    filePath: "exampleFilePath",
    id: 42,
    language: "exampleLanguage",
    newWordCount: 42,
    processingStatus: "exampleProcessingStatus",
    uploadedAt: new Date(),
    wordCount: 42,
  },
];
const FIND_ONE_RESULT = {
  documentName: "exampleDocumentName",
  documentType: "exampleDocumentType",
  filePath: "exampleFilePath",
  id: 42,
  language: "exampleLanguage",
  newWordCount: 42,
  processingStatus: "exampleProcessingStatus",
  uploadedAt: new Date(),
  wordCount: 42,
};

const service = {
  createDocument() {
    return CREATE_RESULT;
  },
  documents: () => FIND_MANY_RESULT,
  document: ({ where }: { where: { id: string } }) => {
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

describe("Document", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DocumentService,
          useValue: service,
        },
      ],
      controllers: [DocumentController],
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

  test("POST /documents", async () => {
    await request(app.getHttpServer())
      .post("/documents")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        uploadedAt: CREATE_RESULT.uploadedAt.toISOString(),
      });
  });

  test("GET /documents", async () => {
    await request(app.getHttpServer())
      .get("/documents")
      .expect(HttpStatus.OK)
      .expect([
        {
          ...FIND_MANY_RESULT[0],
          uploadedAt: FIND_MANY_RESULT[0].uploadedAt.toISOString(),
        },
      ]);
  });

  test("GET /documents/:id non existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/documents"}/${nonExistingId}`)
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: HttpStatus.NOT_FOUND,
        message: `No resource was found for {"${"id"}":"${nonExistingId}"}`,
        error: "Not Found",
      });
  });

  test("GET /documents/:id existing", async () => {
    await request(app.getHttpServer())
      .get(`${"/documents"}/${existingId}`)
      .expect(HttpStatus.OK)
      .expect({
        ...FIND_ONE_RESULT,
        uploadedAt: FIND_ONE_RESULT.uploadedAt.toISOString(),
      });
  });

  test("POST /documents existing resource", async () => {
    const agent = request(app.getHttpServer());
    await agent
      .post("/documents")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        uploadedAt: CREATE_RESULT.uploadedAt.toISOString(),
      })
      .then(function () {
        agent
          .post("/documents")
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
