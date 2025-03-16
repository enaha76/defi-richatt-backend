import { Module } from "@nestjs/common";
import { RoleModule } from "./role/role.module";
import { UserModule } from "./user/user.module";
import { UserRoleModule } from "./userRole/userRole.module";
import { ChallengeRootModule } from "./challengeRoot/challengeRoot.module";
import { RootModule } from "./root/root.module";
import { DictionaryEntryModule } from "./dictionaryEntry/dictionaryEntry.module";
import { DefinitionModule } from "./definition/definition.module";
import { ExampleModule } from "./example/example.module";
import { SubmissionModule } from "./submission/submission.module";
import { CommentModule } from "./comment/comment.module";
import { BadgeModule } from "./badge/badge.module";
import { UserBadgeModule } from "./userBadge/userBadge.module";
import { ActivityModule } from "./activity/activity.module";
import { DocumentModule } from "./document/document.module";
import { ExtractedWordModule } from "./extractedWord/extractedWord.module";
import { AiSuggestionModule } from "./aiSuggestion/aiSuggestion.module";
import { SettingModule } from "./setting/setting.module";
import { AuditLogModule } from "./auditLog/auditLog.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  controllers: [],
  imports: [
    RoleModule,
    UserModule,
    UserRoleModule,
    ChallengeRootModule,
    RootModule,
    DictionaryEntryModule,
    DefinitionModule,
    ExampleModule,
    SubmissionModule,
    CommentModule,
    BadgeModule,
    UserBadgeModule,
    ActivityModule,
    DocumentModule,
    ExtractedWordModule,
    AiSuggestionModule,
    SettingModule,
    AuditLogModule,
    HealthModule,
    PrismaModule,
    SecretsManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const playground = configService.get("GRAPHQL_PLAYGROUND");
        const introspection = configService.get("GRAPHQL_INTROSPECTION");
        return {
          autoSchemaFile: "schema.graphql",
          sortSchema: true,
          playground,
          introspection: playground || introspection,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [],
})
export class AppModule {}
