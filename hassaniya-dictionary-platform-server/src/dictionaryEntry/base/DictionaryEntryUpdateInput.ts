/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { ActivityUpdateManyWithoutDictionaryEntriesInput } from "./ActivityUpdateManyWithoutDictionaryEntriesInput";
import {
  ValidateNested,
  IsOptional,
  IsDate,
  IsString,
  MaxLength,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { AiSuggestionUpdateManyWithoutDictionaryEntriesInput } from "./AiSuggestionUpdateManyWithoutDictionaryEntriesInput";
import { UserWhereUniqueInput } from "../../user/base/UserWhereUniqueInput";
import { CommentUpdateManyWithoutDictionaryEntriesInput } from "./CommentUpdateManyWithoutDictionaryEntriesInput";
import { DefinitionUpdateManyWithoutDictionaryEntriesInput } from "./DefinitionUpdateManyWithoutDictionaryEntriesInput";
import { ExampleUpdateManyWithoutDictionaryEntriesInput } from "./ExampleUpdateManyWithoutDictionaryEntriesInput";
import { ExtractedWordUpdateManyWithoutDictionaryEntriesInput } from "./ExtractedWordUpdateManyWithoutDictionaryEntriesInput";
import { RootWhereUniqueInput } from "../../root/base/RootWhereUniqueInput";
import { SubmissionUpdateManyWithoutDictionaryEntriesInput } from "./SubmissionUpdateManyWithoutDictionaryEntriesInput";

@InputType()
class DictionaryEntryUpdateInput {
  @ApiProperty({
    required: false,
    type: () => ActivityUpdateManyWithoutDictionaryEntriesInput,
  })
  @ValidateNested()
  @Type(() => ActivityUpdateManyWithoutDictionaryEntriesInput)
  @IsOptional()
  @Field(() => ActivityUpdateManyWithoutDictionaryEntriesInput, {
    nullable: true,
  })
  activities?: ActivityUpdateManyWithoutDictionaryEntriesInput;

  @ApiProperty({
    required: false,
    type: () => AiSuggestionUpdateManyWithoutDictionaryEntriesInput,
  })
  @ValidateNested()
  @Type(() => AiSuggestionUpdateManyWithoutDictionaryEntriesInput)
  @IsOptional()
  @Field(() => AiSuggestionUpdateManyWithoutDictionaryEntriesInput, {
    nullable: true,
  })
  aiSuggestions?: AiSuggestionUpdateManyWithoutDictionaryEntriesInput;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  approvalDate?: Date | null;

  @ApiProperty({
    required: false,
    type: () => UserWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  @IsOptional()
  @Field(() => UserWhereUniqueInput, {
    nullable: true,
  })
  approvalUser?: UserWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  audioFilePath?: string | null;

  @ApiProperty({
    required: false,
    type: () => CommentUpdateManyWithoutDictionaryEntriesInput,
  })
  @ValidateNested()
  @Type(() => CommentUpdateManyWithoutDictionaryEntriesInput)
  @IsOptional()
  @Field(() => CommentUpdateManyWithoutDictionaryEntriesInput, {
    nullable: true,
  })
  comments?: CommentUpdateManyWithoutDictionaryEntriesInput;

  @ApiProperty({
    required: false,
    type: () => UserWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  @IsOptional()
  @Field(() => UserWhereUniqueInput, {
    nullable: true,
  })
  creator?: UserWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: () => DefinitionUpdateManyWithoutDictionaryEntriesInput,
  })
  @ValidateNested()
  @Type(() => DefinitionUpdateManyWithoutDictionaryEntriesInput)
  @IsOptional()
  @Field(() => DefinitionUpdateManyWithoutDictionaryEntriesInput, {
    nullable: true,
  })
  definitions?: DefinitionUpdateManyWithoutDictionaryEntriesInput;

  @ApiProperty({
    required: false,
    type: () => ExampleUpdateManyWithoutDictionaryEntriesInput,
  })
  @ValidateNested()
  @Type(() => ExampleUpdateManyWithoutDictionaryEntriesInput)
  @IsOptional()
  @Field(() => ExampleUpdateManyWithoutDictionaryEntriesInput, {
    nullable: true,
  })
  examples?: ExampleUpdateManyWithoutDictionaryEntriesInput;

  @ApiProperty({
    required: false,
    type: () => ExtractedWordUpdateManyWithoutDictionaryEntriesInput,
  })
  @ValidateNested()
  @Type(() => ExtractedWordUpdateManyWithoutDictionaryEntriesInput)
  @IsOptional()
  @Field(() => ExtractedWordUpdateManyWithoutDictionaryEntriesInput, {
    nullable: true,
  })
  extractedWords?: ExtractedWordUpdateManyWithoutDictionaryEntriesInput;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, {
    nullable: true,
  })
  isChallengeWord?: boolean;

  @ApiProperty({
    required: false,
    type: () => UserWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  @IsOptional()
  @Field(() => UserWhereUniqueInput, {
    nullable: true,
  })
  lastEditor?: UserWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  originType?: string | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  partOfSpeech?: string | null;

  @ApiProperty({
    required: false,
    type: () => RootWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => RootWhereUniqueInput)
  @IsOptional()
  @Field(() => RootWhereUniqueInput, {
    nullable: true,
  })
  root?: RootWhereUniqueInput | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  status?: string;

  @ApiProperty({
    required: false,
    type: () => SubmissionUpdateManyWithoutDictionaryEntriesInput,
  })
  @ValidateNested()
  @Type(() => SubmissionUpdateManyWithoutDictionaryEntriesInput)
  @IsOptional()
  @Field(() => SubmissionUpdateManyWithoutDictionaryEntriesInput, {
    nullable: true,
  })
  submissions?: SubmissionUpdateManyWithoutDictionaryEntriesInput;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  transliteration?: string | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  verbForm?: string | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  word?: string;
}

export { DictionaryEntryUpdateInput as DictionaryEntryUpdateInput };
