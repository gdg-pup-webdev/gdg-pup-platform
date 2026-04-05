import { contract, models } from "@packages/nexus-api-contracts";

export type Article = models.v1.articles.record.articleRecord;

export type ArticleInsert = models.v1.articles.record.articleRecordInsertDTO;

export type ArticleUpdate = models.v1.articles.record.articleRecordUpdateDTO;

export type UserType = contract.api.v1.gdgmembers.GET.response[200]["data"][0];