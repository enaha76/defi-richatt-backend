/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { PrismaService } from "../../prisma/prisma.service";

import {
  Prisma,
  Submission as PrismaSubmission,
  DictionaryEntry as PrismaDictionaryEntry,
  User as PrismaUser,
} from "@prisma/client";

export class SubmissionServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async count(
    args: Omit<Prisma.SubmissionCountArgs, "select">
  ): Promise<number> {
    return this.prisma.submission.count(args);
  }

  async submissions(
    args: Prisma.SubmissionFindManyArgs
  ): Promise<PrismaSubmission[]> {
    return this.prisma.submission.findMany(args);
  }
  async submission(
    args: Prisma.SubmissionFindUniqueArgs
  ): Promise<PrismaSubmission | null> {
    return this.prisma.submission.findUnique(args);
  }
  async createSubmission(
    args: Prisma.SubmissionCreateArgs
  ): Promise<PrismaSubmission> {
    return this.prisma.submission.create(args);
  }
  async updateSubmission(
    args: Prisma.SubmissionUpdateArgs
  ): Promise<PrismaSubmission> {
    return this.prisma.submission.update(args);
  }
  async deleteSubmission(
    args: Prisma.SubmissionDeleteArgs
  ): Promise<PrismaSubmission> {
    return this.prisma.submission.delete(args);
  }

  async getEntry(parentId: number): Promise<PrismaDictionaryEntry | null> {
    return this.prisma.submission
      .findUnique({
        where: { id: parentId },
      })
      .entry();
  }

  async getReviewer(parentId: number): Promise<PrismaUser | null> {
    return this.prisma.submission
      .findUnique({
        where: { id: parentId },
      })
      .reviewer();
  }

  async getUser(parentId: number): Promise<PrismaUser | null> {
    return this.prisma.submission
      .findUnique({
        where: { id: parentId },
      })
      .user();
  }
}
