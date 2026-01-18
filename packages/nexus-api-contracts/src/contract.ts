
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {z} from "zod";

import { query as api_article_system_articles_articleId_comments_GET_query } from "./routes/api/article-system/articles/[articleId]/comments/GET";
import { response as api_article_system_articles_articleId_comments_GET_response } from "./routes/api/article-system/articles/[articleId]/comments/GET";
import { body as api_article_system_articles_articleId_comments_POST_body } from "./routes/api/article-system/articles/[articleId]/comments/POST";
import { response as api_article_system_articles_articleId_comments_POST_response } from "./routes/api/article-system/articles/[articleId]/comments/POST";
import { response as api_article_system_articles_articleId_comments_commentId_DELETE_response } from "./routes/api/article-system/articles/[articleId]/comments/[commentId]/DELETE";
import { body as api_event_system_checkin_POST_body } from "./routes/api/event-system/checkin/POST";
import { response as api_event_system_checkin_POST_response } from "./routes/api/event-system/checkin/POST";
import { query as api_event_system_events_GET_query } from "./routes/api/event-system/events/GET";
import { response as api_event_system_events_GET_response } from "./routes/api/event-system/events/GET";
import { body as api_event_system_events_POST_body } from "./routes/api/event-system/events/POST";
import { response as api_event_system_events_POST_response } from "./routes/api/event-system/events/POST";
import { query as api_event_system_events_eventId_attendees_GET_query } from "./routes/api/event-system/events/[eventId]/attendees/GET";
import { response as api_event_system_events_eventId_attendees_GET_response } from "./routes/api/event-system/events/[eventId]/attendees/GET";
import { response as api_event_system_events_eventId_DELETE_response } from "./routes/api/event-system/events/[eventId]/DELETE";
import { response as api_event_system_events_eventId_GET_response } from "./routes/api/event-system/events/[eventId]/GET";
import { body as api_event_system_events_eventId_PATCH_body } from "./routes/api/event-system/events/[eventId]/PATCH";
import { response as api_event_system_events_eventId_PATCH_response } from "./routes/api/event-system/events/[eventId]/PATCH";
import { query as api_file_system_files_GET_query } from "./routes/api/file-system/files/GET";
import { response as api_file_system_files_GET_response } from "./routes/api/file-system/files/GET";
import { body as api_file_system_files_POST_body } from "./routes/api/file-system/files/POST";
import { response as api_file_system_files_POST_response } from "./routes/api/file-system/files/POST";
import { response as api_file_system_files_fileId_DELETE_response } from "./routes/api/file-system/files/[fileId]/DELETE";
import { response as api_file_system_files_fileId_GET_response } from "./routes/api/file-system/files/[fileId]/GET";
import { body as api_file_system_files_fileId_PATCH_body } from "./routes/api/file-system/files/[fileId]/PATCH";
import { response as api_file_system_files_fileId_PATCH_response } from "./routes/api/file-system/files/[fileId]/PATCH";
import { response as api_health_GET_response } from "./routes/api/health/GET";
import { response as api_leaderboard_system_GET_response } from "./routes/api/leaderboard-system/GET";
import { query as api_learning_resource_system_externalResources_GET_query } from "./routes/api/learning-resource-system/externalResources/GET";
import { response as api_learning_resource_system_externalResources_GET_response } from "./routes/api/learning-resource-system/externalResources/GET";
import { body as api_learning_resource_system_externalResources_POST_body } from "./routes/api/learning-resource-system/externalResources/POST";
import { response as api_learning_resource_system_externalResources_POST_response } from "./routes/api/learning-resource-system/externalResources/POST";
import { response as api_learning_resource_system_externalResources_externalResourceId_DELETE_response } from "./routes/api/learning-resource-system/externalResources/[externalResourceId]/DELETE";
import { response as api_learning_resource_system_externalResources_externalResourceId_GET_response } from "./routes/api/learning-resource-system/externalResources/[externalResourceId]/GET";
import { body as api_learning_resource_system_externalResources_externalResourceId_PATCH_body } from "./routes/api/learning-resource-system/externalResources/[externalResourceId]/PATCH";
import { response as api_learning_resource_system_externalResources_externalResourceId_PATCH_response } from "./routes/api/learning-resource-system/externalResources/[externalResourceId]/PATCH";
import { query as api_learning_resource_system_GET_query } from "./routes/api/learning-resource-system/GET";
import { response as api_learning_resource_system_GET_response } from "./routes/api/learning-resource-system/GET";
import { query as api_learning_resource_system_study_jams_GET_query } from "./routes/api/learning-resource-system/study-jams/GET";
import { response as api_learning_resource_system_study_jams_GET_response } from "./routes/api/learning-resource-system/study-jams/GET";
import { body as api_learning_resource_system_study_jams_POST_body } from "./routes/api/learning-resource-system/study-jams/POST";
import { response as api_learning_resource_system_study_jams_POST_response } from "./routes/api/learning-resource-system/study-jams/POST";
import { response as api_learning_resource_system_study_jams_studyJamId_DELETE_response } from "./routes/api/learning-resource-system/study-jams/[studyJamId]/DELETE";
import { response as api_learning_resource_system_study_jams_studyJamId_GET_response } from "./routes/api/learning-resource-system/study-jams/[studyJamId]/GET";
import { body as api_learning_resource_system_study_jams_studyJamId_PATCH_body } from "./routes/api/learning-resource-system/study-jams/[studyJamId]/PATCH";
import { response as api_learning_resource_system_study_jams_studyJamId_PATCH_response } from "./routes/api/learning-resource-system/study-jams/[studyJamId]/PATCH";
import { query as api_publication_system_articles_GET_query } from "./routes/api/publication-system/articles/GET";
import { response as api_publication_system_articles_GET_response } from "./routes/api/publication-system/articles/GET";
import { body as api_publication_system_articles_POST_body } from "./routes/api/publication-system/articles/POST";
import { response as api_publication_system_articles_POST_response } from "./routes/api/publication-system/articles/POST";
import { response as api_publication_system_articles_articleId_DELETE_response } from "./routes/api/publication-system/articles/[articleId]/DELETE";
import { response as api_publication_system_articles_articleId_GET_response } from "./routes/api/publication-system/articles/[articleId]/GET";
import { body as api_publication_system_articles_articleId_PATCH_body } from "./routes/api/publication-system/articles/[articleId]/PATCH";
import { response as api_publication_system_articles_articleId_PATCH_response } from "./routes/api/publication-system/articles/[articleId]/PATCH";
import { query as api_publication_system_events_GET_query } from "./routes/api/publication-system/events/GET";
import { response as api_publication_system_events_GET_response } from "./routes/api/publication-system/events/GET";
import { body as api_publication_system_events_POST_body } from "./routes/api/publication-system/events/POST";
import { response as api_publication_system_events_POST_response } from "./routes/api/publication-system/events/POST";
import { response as api_publication_system_events_articleId_DELETE_response } from "./routes/api/publication-system/events/[articleId]/DELETE";
import { response as api_publication_system_events_articleId_GET_response } from "./routes/api/publication-system/events/[articleId]/GET";
import { body as api_publication_system_events_articleId_PATCH_body } from "./routes/api/publication-system/events/[articleId]/PATCH";
import { response as api_publication_system_events_articleId_PATCH_response } from "./routes/api/publication-system/events/[articleId]/PATCH";
import { query as api_publication_system_highlights_GET_query } from "./routes/api/publication-system/highlights/GET";
import { response as api_publication_system_highlights_GET_response } from "./routes/api/publication-system/highlights/GET";
import { body as api_publication_system_highlights_POST_body } from "./routes/api/publication-system/highlights/POST";
import { response as api_publication_system_highlights_POST_response } from "./routes/api/publication-system/highlights/POST";
import { response as api_publication_system_highlights_articleId_DELETE_response } from "./routes/api/publication-system/highlights/[articleId]/DELETE";
import { response as api_publication_system_highlights_articleId_GET_response } from "./routes/api/publication-system/highlights/[articleId]/GET";
import { body as api_publication_system_highlights_articleId_PATCH_body } from "./routes/api/publication-system/highlights/[articleId]/PATCH";
import { response as api_publication_system_highlights_articleId_PATCH_response } from "./routes/api/publication-system/highlights/[articleId]/PATCH";
import { query as api_rbac_system_roles_GET_query } from "./routes/api/rbac-system/roles/GET";
import { response as api_rbac_system_roles_GET_response } from "./routes/api/rbac-system/roles/GET";
import { body as api_rbac_system_roles_POST_body } from "./routes/api/rbac-system/roles/POST";
import { response as api_rbac_system_roles_POST_response } from "./routes/api/rbac-system/roles/POST";
import { response as api_rbac_system_roles_roleId_DELETE_response } from "./routes/api/rbac-system/roles/[roleId]/DELETE";
import { response as api_rbac_system_roles_roleId_GET_response } from "./routes/api/rbac-system/roles/[roleId]/GET";
import { response as api_rbac_system_roles_roleId_parent_GET_response } from "./routes/api/rbac-system/roles/[roleId]/parent/GET";
import { response as api_rbac_system_roles_roleId_PATCH_response } from "./routes/api/rbac-system/roles/[roleId]/PATCH";
import { description as api_rbac_system_roles_roleId_permissions_GET_description } from "./routes/api/rbac-system/roles/[roleId]/permissions/GET";
import { query as api_rbac_system_roles_roleId_permissions_GET_query } from "./routes/api/rbac-system/roles/[roleId]/permissions/GET";
import { response as api_rbac_system_roles_roleId_permissions_GET_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/GET";
import { body as api_rbac_system_roles_roleId_permissions_POST_body } from "./routes/api/rbac-system/roles/[roleId]/permissions/POST";
import { response as api_rbac_system_roles_roleId_permissions_POST_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/POST";
import { response as api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/[permissionId]/DELETE";
import { response as api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/[permissionId]/PATCH";
import { query as api_team_system_members_GET_query } from "./routes/api/team-system/members/GET";
import { response as api_team_system_members_GET_response } from "./routes/api/team-system/members/GET";
import { body as api_team_system_members_POST_body } from "./routes/api/team-system/members/POST";
import { response as api_team_system_members_POST_response } from "./routes/api/team-system/members/POST";
import { response as api_team_system_members_memberId_DELETE_response } from "./routes/api/team-system/members/[memberId]/DELETE";
import { response as api_team_system_members_memberId_GET_response } from "./routes/api/team-system/members/[memberId]/GET";
import { query as api_team_system_teams_GET_query } from "./routes/api/team-system/teams/GET";
import { response as api_team_system_teams_GET_response } from "./routes/api/team-system/teams/GET";
import { body as api_team_system_teams_POST_body } from "./routes/api/team-system/teams/POST";
import { response as api_team_system_teams_POST_response } from "./routes/api/team-system/teams/POST";
import { response as api_team_system_teams_teamId_DELETE_response } from "./routes/api/team-system/teams/[teamId]/DELETE";
import { response as api_team_system_teams_teamId_GET_response } from "./routes/api/team-system/teams/[teamId]/GET";
import { description as api_team_system_teams_teamId_members_GET_description } from "./routes/api/team-system/teams/[teamId]/members/GET";
import { query as api_team_system_teams_teamId_members_GET_query } from "./routes/api/team-system/teams/[teamId]/members/GET";
import { response as api_team_system_teams_teamId_members_GET_response } from "./routes/api/team-system/teams/[teamId]/members/GET";
import { description as api_team_system_teams_teamId_members_POST_description } from "./routes/api/team-system/teams/[teamId]/members/POST";
import { body as api_team_system_teams_teamId_members_POST_body } from "./routes/api/team-system/teams/[teamId]/members/POST";
import { response as api_team_system_teams_teamId_members_POST_response } from "./routes/api/team-system/teams/[teamId]/members/POST";
import { body as api_team_system_teams_teamId_PATCH_body } from "./routes/api/team-system/teams/[teamId]/PATCH";
import { response as api_team_system_teams_teamId_PATCH_response } from "./routes/api/team-system/teams/[teamId]/PATCH";
import { query as api_user_resource_system_achivements_GET_query } from "./routes/api/user-resource-system/achivements/GET";
import { response as api_user_resource_system_achivements_GET_response } from "./routes/api/user-resource-system/achivements/GET";
import { body as api_user_resource_system_achivements_POST_body } from "./routes/api/user-resource-system/achivements/POST";
import { response as api_user_resource_system_achivements_POST_response } from "./routes/api/user-resource-system/achivements/POST";
import { response as api_user_resource_system_achivements_projectId_DELETE_response } from "./routes/api/user-resource-system/achivements/[projectId]/DELETE";
import { query as api_user_resource_system_achivements_projectId_GET_query } from "./routes/api/user-resource-system/achivements/[projectId]/GET";
import { response as api_user_resource_system_achivements_projectId_GET_response } from "./routes/api/user-resource-system/achivements/[projectId]/GET";
import { body as api_user_resource_system_achivements_projectId_PATCH_body } from "./routes/api/user-resource-system/achivements/[projectId]/PATCH";
import { response as api_user_resource_system_achivements_projectId_PATCH_response } from "./routes/api/user-resource-system/achivements/[projectId]/PATCH";
import { query as api_user_resource_system_certificates_GET_query } from "./routes/api/user-resource-system/certificates/GET";
import { response as api_user_resource_system_certificates_GET_response } from "./routes/api/user-resource-system/certificates/GET";
import { body as api_user_resource_system_certificates_POST_body } from "./routes/api/user-resource-system/certificates/POST";
import { response as api_user_resource_system_certificates_POST_response } from "./routes/api/user-resource-system/certificates/POST";
import { response as api_user_resource_system_certificates_projectId_DELETE_response } from "./routes/api/user-resource-system/certificates/[projectId]/DELETE";
import { query as api_user_resource_system_certificates_projectId_GET_query } from "./routes/api/user-resource-system/certificates/[projectId]/GET";
import { response as api_user_resource_system_certificates_projectId_GET_response } from "./routes/api/user-resource-system/certificates/[projectId]/GET";
import { body as api_user_resource_system_certificates_projectId_PATCH_body } from "./routes/api/user-resource-system/certificates/[projectId]/PATCH";
import { response as api_user_resource_system_certificates_projectId_PATCH_response } from "./routes/api/user-resource-system/certificates/[projectId]/PATCH";
import { query as api_user_resource_system_profiles_GET_query } from "./routes/api/user-resource-system/profiles/GET";
import { response as api_user_resource_system_profiles_GET_response } from "./routes/api/user-resource-system/profiles/GET";
import { body as api_user_resource_system_profiles_POST_body } from "./routes/api/user-resource-system/profiles/POST";
import { response as api_user_resource_system_profiles_POST_response } from "./routes/api/user-resource-system/profiles/POST";
import { response as api_user_resource_system_profiles_projectId_DELETE_response } from "./routes/api/user-resource-system/profiles/[projectId]/DELETE";
import { query as api_user_resource_system_profiles_projectId_GET_query } from "./routes/api/user-resource-system/profiles/[projectId]/GET";
import { response as api_user_resource_system_profiles_projectId_GET_response } from "./routes/api/user-resource-system/profiles/[projectId]/GET";
import { body as api_user_resource_system_profiles_projectId_PATCH_body } from "./routes/api/user-resource-system/profiles/[projectId]/PATCH";
import { response as api_user_resource_system_profiles_projectId_PATCH_response } from "./routes/api/user-resource-system/profiles/[projectId]/PATCH";
import { query as api_user_resource_system_projects_GET_query } from "./routes/api/user-resource-system/projects/GET";
import { response as api_user_resource_system_projects_GET_response } from "./routes/api/user-resource-system/projects/GET";
import { body as api_user_resource_system_projects_POST_body } from "./routes/api/user-resource-system/projects/POST";
import { response as api_user_resource_system_projects_POST_response } from "./routes/api/user-resource-system/projects/POST";
import { response as api_user_resource_system_projects_projectId_DELETE_response } from "./routes/api/user-resource-system/projects/[projectId]/DELETE";
import { query as api_user_resource_system_projects_projectId_GET_query } from "./routes/api/user-resource-system/projects/[projectId]/GET";
import { response as api_user_resource_system_projects_projectId_GET_response } from "./routes/api/user-resource-system/projects/[projectId]/GET";
import { body as api_user_resource_system_projects_projectId_PATCH_body } from "./routes/api/user-resource-system/projects/[projectId]/PATCH";
import { response as api_user_resource_system_projects_projectId_PATCH_response } from "./routes/api/user-resource-system/projects/[projectId]/PATCH";
import { query as api_user_resource_system_settings_GET_query } from "./routes/api/user-resource-system/settings/GET";
import { response as api_user_resource_system_settings_GET_response } from "./routes/api/user-resource-system/settings/GET";
import { body as api_user_resource_system_settings_POST_body } from "./routes/api/user-resource-system/settings/POST";
import { response as api_user_resource_system_settings_POST_response } from "./routes/api/user-resource-system/settings/POST";
import { response as api_user_resource_system_settings_projectId_DELETE_response } from "./routes/api/user-resource-system/settings/[projectId]/DELETE";
import { query as api_user_resource_system_settings_projectId_GET_query } from "./routes/api/user-resource-system/settings/[projectId]/GET";
import { response as api_user_resource_system_settings_projectId_GET_response } from "./routes/api/user-resource-system/settings/[projectId]/GET";
import { body as api_user_resource_system_settings_projectId_PATCH_body } from "./routes/api/user-resource-system/settings/[projectId]/PATCH";
import { response as api_user_resource_system_settings_projectId_PATCH_response } from "./routes/api/user-resource-system/settings/[projectId]/PATCH";
import { response as api_user_resource_system_users_userId_GET_response } from "./routes/api/user-resource-system/users/[userId]/GET";
import { response as api_user_resource_system_users_userId_profile_GET_response } from "./routes/api/user-resource-system/users/[userId]/profile/GET";
import { query as api_user_resource_system_users_userId_projects_GET_query } from "./routes/api/user-resource-system/users/[userId]/projects/GET";
import { response as api_user_resource_system_users_userId_projects_GET_response } from "./routes/api/user-resource-system/users/[userId]/projects/GET";
import { response as api_user_resource_system_users_userId_roles_GET_response } from "./routes/api/user-resource-system/users/[userId]/roles/GET";
import { response as api_user_resource_system_users_userId_wallet_GET_response } from "./routes/api/user-resource-system/users/[userId]/wallet/GET";
import { query as api_user_resource_system_users_userId_wallet_transactions_GET_query } from "./routes/api/user-resource-system/users/[userId]/wallet/transactions/GET";
import { response as api_user_resource_system_users_userId_wallet_transactions_GET_response } from "./routes/api/user-resource-system/users/[userId]/wallet/transactions/GET";
import { response as api_user_system_users_userId_GET_response } from "./routes/api/user-system/users/[userId]/GET";
import { response as api_user_system_users_userId_profile_GET_response } from "./routes/api/user-system/users/[userId]/profile/GET";
import { query as api_user_system_users_userId_projects_GET_query } from "./routes/api/user-system/users/[userId]/projects/GET";
import { response as api_user_system_users_userId_projects_GET_response } from "./routes/api/user-system/users/[userId]/projects/GET";
import { response as api_user_system_users_userId_roles_GET_response } from "./routes/api/user-system/users/[userId]/roles/GET";
import { response as api_user_system_users_userId_wallet_GET_response } from "./routes/api/user-system/users/[userId]/wallet/GET";
import { query as api_user_system_users_userId_wallet_transactions_GET_query } from "./routes/api/user-system/users/[userId]/wallet/transactions/GET";
import { response as api_user_system_users_userId_wallet_transactions_GET_response } from "./routes/api/user-system/users/[userId]/wallet/transactions/GET";
import { ArticleModels as model_articleSystem_article_model_ArticleModels } from "./models/articleSystem/article.model";
import { ArticleCommentModels as model_articleSystem_comment_model_ArticleCommentModels } from "./models/articleSystem/comment.model";
import { ArticleSystemModels as model_articleSystem_index_ArticleSystemModels } from "./models/articleSystem/index";
import { EconomySystemModels as model_economySystem_index_EconomySystemModels } from "./models/economySystem/index";
import { TransactionModels as model_economySystem_transaction_TransactionModels } from "./models/economySystem/transaction";
import { WalletModels as model_economySystem_wallet_WalletModels } from "./models/economySystem/wallet";
import { AttendanceModels as model_eventSystem_attendance_model_AttendanceModels } from "./models/eventSystem/attendance.model";
import { AttendeeModels as model_eventSystem_attendee_model_AttendeeModels } from "./models/eventSystem/attendee.model";
import { CheckinModels as model_eventSystem_checkin_model_CheckinModels } from "./models/eventSystem/checkin.model";
import { EventModels as model_eventSystem_event_model_EventModels } from "./models/eventSystem/event.model";
import { EventSystemModels as model_eventSystem_index_EventSystemModels } from "./models/eventSystem/index";
import { row as model_fileSystem_file_row } from "./models/fileSystem/file";
import { insert as model_fileSystem_file_insert } from "./models/fileSystem/file";
import { update as model_fileSystem_file_update } from "./models/fileSystem/file";
import { Models as model_index_Models } from "./models//index";
import { row as model_learningResourceSystem_externalResource_row } from "./models/learningResourceSystem/externalResource";
import { insert as model_learningResourceSystem_externalResource_insert } from "./models/learningResourceSystem/externalResource";
import { update as model_learningResourceSystem_externalResource_update } from "./models/learningResourceSystem/externalResource";
import { shape as model_learningResourceSystem_learningResource_shape } from "./models/learningResourceSystem/learningResource";
import { row as model_learningResourceSystem_studyJam_row } from "./models/learningResourceSystem/studyJam";
import { insert as model_learningResourceSystem_studyJam_insert } from "./models/learningResourceSystem/studyJam";
import { update as model_learningResourceSystem_studyJam_update } from "./models/learningResourceSystem/studyJam";
import { row as model_publicationSystem_article_row } from "./models/publicationSystem/article";
import { insert as model_publicationSystem_article_insert } from "./models/publicationSystem/article";
import { update as model_publicationSystem_article_update } from "./models/publicationSystem/article";
import { row as model_publicationSystem_event_row } from "./models/publicationSystem/event";
import { insert as model_publicationSystem_event_insert } from "./models/publicationSystem/event";
import { update as model_publicationSystem_event_update } from "./models/publicationSystem/event";
import { row as model_publicationSystem_highlight_row } from "./models/publicationSystem/highlight";
import { insert as model_publicationSystem_highlight_insert } from "./models/publicationSystem/highlight";
import { update as model_publicationSystem_highlight_update } from "./models/publicationSystem/highlight";
import { row as model_rbacSystem_permission_row } from "./models/rbacSystem/permission";
import { insert as model_rbacSystem_permission_insert } from "./models/rbacSystem/permission";
import { update as model_rbacSystem_permission_update } from "./models/rbacSystem/permission";
import { row as model_rbacSystem_roles_row } from "./models/rbacSystem/roles";
import { insert as model_rbacSystem_roles_insert } from "./models/rbacSystem/roles";
import { update as model_rbacSystem_roles_update } from "./models/rbacSystem/roles";
import { row as model_resourceSystem_resource_row } from "./models/resourceSystem/resource";
import { insertDTO as model_resourceSystem_resource_insertDTO } from "./models/resourceSystem/resource";
import { updateDTO as model_resourceSystem_resource_updateDTO } from "./models/resourceSystem/resource";
import { row as model_roleSystem_role_row } from "./models/roleSystem/role";
import { insertDTO as model_roleSystem_role_insertDTO } from "./models/roleSystem/role";
import { updateDTO as model_roleSystem_role_updateDTO } from "./models/roleSystem/role";
import { row as model_teamSystem_member_row } from "./models/teamSystem/member";
import { insert as model_teamSystem_member_insert } from "./models/teamSystem/member";
import { team as model_teamSystem_team_team } from "./models/teamSystem/team";
import { teamInsertDTO as model_teamSystem_team_teamInsertDTO } from "./models/teamSystem/team";
import { teamUpdateDTO as model_teamSystem_team_teamUpdateDTO } from "./models/teamSystem/team";
import { row as model_userResourceSystem_project_row } from "./models/userResourceSystem/project";
import { insertDTO as model_userResourceSystem_project_insertDTO } from "./models/userResourceSystem/project";
import { updateDTO as model_userResourceSystem_project_updateDTO } from "./models/userResourceSystem/project";
import { row as model_userSystem_profile_row } from "./models/userSystem/profile";
import { insertDTO as model_userSystem_profile_insertDTO } from "./models/userSystem/profile";
import { updateDTO as model_userSystem_profile_updateDTO } from "./models/userSystem/profile";
import { row as model_userSystem_user_row } from "./models/userSystem/user";
import { insertDTO as model_userSystem_user_insertDTO } from "./models/userSystem/user";
import { updateDTO as model_userSystem_user_updateDTO } from "./models/userSystem/user";


export const contract = {
  "api": {
    "article_system": {
      "articles": {
        "articleId": {
          "comments": {
            "GET": {
              "request": {
                "params": z.object({articleId: z.string()}),
                "query": api_article_system_articles_articleId_comments_GET_query
              },
              "response": api_article_system_articles_articleId_comments_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/article-system/articles/[articleId]/comments",
                "signature": "api_article_system_articles_articleId_comments_GET"
              }
            },
            "POST": {
              "request": {
                "params": z.object({articleId: z.string()}),
                "body": api_article_system_articles_articleId_comments_POST_body
              },
              "response": api_article_system_articles_articleId_comments_POST_response,
              "metadata": {
                "method": "POST",
                "path": "/api/article-system/articles/[articleId]/comments",
                "signature": "api_article_system_articles_articleId_comments_POST"
              }
            },
            "commentId": {
              "DELETE": {
                "request": {
                  "params": z.object({articleId: z.string(),commentId: z.string()})
                },
                "response": api_article_system_articles_articleId_comments_commentId_DELETE_response,
                "metadata": {
                  "method": "DELETE",
                  "path": "/api/article-system/articles/[articleId]/comments/[commentId]",
                  "signature": "api_article_system_articles_articleId_comments_commentId_DELETE"
                }
              }
            }
          }
        }
      }
    },
    "event_system": {
      "checkin": {
        "POST": {
          "request": {
            "body": api_event_system_checkin_POST_body
          },
          "response": api_event_system_checkin_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/event-system/checkin",
            "signature": "api_event_system_checkin_POST"
          }
        }
      },
      "events": {
        "GET": {
          "request": {
            "query": api_event_system_events_GET_query
          },
          "response": api_event_system_events_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/event-system/events",
            "signature": "api_event_system_events_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_event_system_events_POST_body
          },
          "response": api_event_system_events_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/event-system/events",
            "signature": "api_event_system_events_POST"
          }
        },
        "eventId": {
          "attendees": {
            "GET": {
              "request": {
                "params": z.object({eventId: z.string()}),
                "query": api_event_system_events_eventId_attendees_GET_query
              },
              "response": api_event_system_events_eventId_attendees_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/event-system/events/[eventId]/attendees",
                "signature": "api_event_system_events_eventId_attendees_GET"
              }
            }
          },
          "DELETE": {
            "request": {
              "params": z.object({eventId: z.string()})
            },
            "response": api_event_system_events_eventId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/event-system/events/[eventId]",
              "signature": "api_event_system_events_eventId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({eventId: z.string()})
            },
            "response": api_event_system_events_eventId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/event-system/events/[eventId]",
              "signature": "api_event_system_events_eventId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({eventId: z.string()}),
              "body": api_event_system_events_eventId_PATCH_body
            },
            "response": api_event_system_events_eventId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/event-system/events/[eventId]",
              "signature": "api_event_system_events_eventId_PATCH"
            }
          }
        }
      }
    },
    "file_system": {
      "files": {
        "GET": {
          "request": {
            "query": api_file_system_files_GET_query
          },
          "response": api_file_system_files_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/file-system/files",
            "signature": "api_file_system_files_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_file_system_files_POST_body
          },
          "response": api_file_system_files_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/file-system/files",
            "signature": "api_file_system_files_POST"
          }
        },
        "fileId": {
          "DELETE": {
            "request": {
              "params": z.object({fileId: z.string()})
            },
            "response": api_file_system_files_fileId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/file-system/files/[fileId]",
              "signature": "api_file_system_files_fileId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({fileId: z.string()})
            },
            "response": api_file_system_files_fileId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/file-system/files/[fileId]",
              "signature": "api_file_system_files_fileId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({fileId: z.string()}),
              "body": api_file_system_files_fileId_PATCH_body
            },
            "response": api_file_system_files_fileId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/file-system/files/[fileId]",
              "signature": "api_file_system_files_fileId_PATCH"
            }
          }
        }
      }
    },
    "health": {
      "GET": {
        "request": {},
        "response": api_health_GET_response,
        "metadata": {
          "method": "GET",
          "path": "/api/health",
          "signature": "api_health_GET"
        }
      }
    },
    "leaderboard_system": {
      "GET": {
        "request": {},
        "response": api_leaderboard_system_GET_response,
        "metadata": {
          "method": "GET",
          "path": "/api/leaderboard-system",
          "signature": "api_leaderboard_system_GET"
        }
      }
    },
    "learning_resource_system": {
      "externalResources": {
        "GET": {
          "request": {
            "query": api_learning_resource_system_externalResources_GET_query
          },
          "response": api_learning_resource_system_externalResources_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/learning-resource-system/externalResources",
            "signature": "api_learning_resource_system_externalResources_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_learning_resource_system_externalResources_POST_body
          },
          "response": api_learning_resource_system_externalResources_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/learning-resource-system/externalResources",
            "signature": "api_learning_resource_system_externalResources_POST"
          }
        },
        "externalResourceId": {
          "DELETE": {
            "request": {
              "params": z.object({externalResourceId: z.string()})
            },
            "response": api_learning_resource_system_externalResources_externalResourceId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/learning-resource-system/externalResources/[externalResourceId]",
              "signature": "api_learning_resource_system_externalResources_externalResourceId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({externalResourceId: z.string()})
            },
            "response": api_learning_resource_system_externalResources_externalResourceId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/learning-resource-system/externalResources/[externalResourceId]",
              "signature": "api_learning_resource_system_externalResources_externalResourceId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({externalResourceId: z.string()}),
              "body": api_learning_resource_system_externalResources_externalResourceId_PATCH_body
            },
            "response": api_learning_resource_system_externalResources_externalResourceId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/learning-resource-system/externalResources/[externalResourceId]",
              "signature": "api_learning_resource_system_externalResources_externalResourceId_PATCH"
            }
          }
        }
      },
      "GET": {
        "request": {
          "query": api_learning_resource_system_GET_query
        },
        "response": api_learning_resource_system_GET_response,
        "metadata": {
          "method": "GET",
          "path": "/api/learning-resource-system",
          "signature": "api_learning_resource_system_GET"
        }
      },
      "study_jams": {
        "GET": {
          "request": {
            "query": api_learning_resource_system_study_jams_GET_query
          },
          "response": api_learning_resource_system_study_jams_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/learning-resource-system/study-jams",
            "signature": "api_learning_resource_system_study_jams_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_learning_resource_system_study_jams_POST_body
          },
          "response": api_learning_resource_system_study_jams_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/learning-resource-system/study-jams",
            "signature": "api_learning_resource_system_study_jams_POST"
          }
        },
        "studyJamId": {
          "DELETE": {
            "request": {
              "params": z.object({studyJamId: z.string()})
            },
            "response": api_learning_resource_system_study_jams_studyJamId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/learning-resource-system/study-jams/[studyJamId]",
              "signature": "api_learning_resource_system_study_jams_studyJamId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({studyJamId: z.string()})
            },
            "response": api_learning_resource_system_study_jams_studyJamId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/learning-resource-system/study-jams/[studyJamId]",
              "signature": "api_learning_resource_system_study_jams_studyJamId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({studyJamId: z.string()}),
              "body": api_learning_resource_system_study_jams_studyJamId_PATCH_body
            },
            "response": api_learning_resource_system_study_jams_studyJamId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/learning-resource-system/study-jams/[studyJamId]",
              "signature": "api_learning_resource_system_study_jams_studyJamId_PATCH"
            }
          }
        }
      }
    },
    "publication_system": {
      "articles": {
        "GET": {
          "request": {
            "query": api_publication_system_articles_GET_query
          },
          "response": api_publication_system_articles_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/publication-system/articles",
            "signature": "api_publication_system_articles_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_publication_system_articles_POST_body
          },
          "response": api_publication_system_articles_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/publication-system/articles",
            "signature": "api_publication_system_articles_POST"
          }
        },
        "articleId": {
          "DELETE": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_publication_system_articles_articleId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/publication-system/articles/[articleId]",
              "signature": "api_publication_system_articles_articleId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_publication_system_articles_articleId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/publication-system/articles/[articleId]",
              "signature": "api_publication_system_articles_articleId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({articleId: z.string()}),
              "body": api_publication_system_articles_articleId_PATCH_body
            },
            "response": api_publication_system_articles_articleId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/publication-system/articles/[articleId]",
              "signature": "api_publication_system_articles_articleId_PATCH"
            }
          }
        }
      },
      "events": {
        "GET": {
          "request": {
            "query": api_publication_system_events_GET_query
          },
          "response": api_publication_system_events_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/publication-system/events",
            "signature": "api_publication_system_events_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_publication_system_events_POST_body
          },
          "response": api_publication_system_events_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/publication-system/events",
            "signature": "api_publication_system_events_POST"
          }
        },
        "articleId": {
          "DELETE": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_publication_system_events_articleId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/publication-system/events/[articleId]",
              "signature": "api_publication_system_events_articleId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_publication_system_events_articleId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/publication-system/events/[articleId]",
              "signature": "api_publication_system_events_articleId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({articleId: z.string()}),
              "body": api_publication_system_events_articleId_PATCH_body
            },
            "response": api_publication_system_events_articleId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/publication-system/events/[articleId]",
              "signature": "api_publication_system_events_articleId_PATCH"
            }
          }
        }
      },
      "highlights": {
        "GET": {
          "request": {
            "query": api_publication_system_highlights_GET_query
          },
          "response": api_publication_system_highlights_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/publication-system/highlights",
            "signature": "api_publication_system_highlights_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_publication_system_highlights_POST_body
          },
          "response": api_publication_system_highlights_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/publication-system/highlights",
            "signature": "api_publication_system_highlights_POST"
          }
        },
        "articleId": {
          "DELETE": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_publication_system_highlights_articleId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/publication-system/highlights/[articleId]",
              "signature": "api_publication_system_highlights_articleId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_publication_system_highlights_articleId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/publication-system/highlights/[articleId]",
              "signature": "api_publication_system_highlights_articleId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({articleId: z.string()}),
              "body": api_publication_system_highlights_articleId_PATCH_body
            },
            "response": api_publication_system_highlights_articleId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/publication-system/highlights/[articleId]",
              "signature": "api_publication_system_highlights_articleId_PATCH"
            }
          }
        }
      }
    },
    "rbac_system": {
      "roles": {
        "GET": {
          "request": {
            "query": api_rbac_system_roles_GET_query
          },
          "response": api_rbac_system_roles_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/rbac-system/roles",
            "signature": "api_rbac_system_roles_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_rbac_system_roles_POST_body
          },
          "response": api_rbac_system_roles_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/rbac-system/roles",
            "signature": "api_rbac_system_roles_POST"
          }
        },
        "roleId": {
          "DELETE": {
            "request": {
              "params": z.object({roleId: z.string()})
            },
            "response": api_rbac_system_roles_roleId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/rbac-system/roles/[roleId]",
              "signature": "api_rbac_system_roles_roleId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({roleId: z.string()})
            },
            "response": api_rbac_system_roles_roleId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/rbac-system/roles/[roleId]",
              "signature": "api_rbac_system_roles_roleId_GET"
            }
          },
          "parent": {
            "GET": {
              "request": {
                "params": z.object({roleId: z.string()})
              },
              "response": api_rbac_system_roles_roleId_parent_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/rbac-system/roles/[roleId]/parent",
                "signature": "api_rbac_system_roles_roleId_parent_GET"
              }
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({roleId: z.string()})
            },
            "response": api_rbac_system_roles_roleId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/rbac-system/roles/[roleId]",
              "signature": "api_rbac_system_roles_roleId_PATCH"
            }
          },
          "permissions": {
            "GET": {
              "request": {
                "params": z.object({roleId: z.string()}),
                "description": api_rbac_system_roles_roleId_permissions_GET_description,
                "query": api_rbac_system_roles_roleId_permissions_GET_query
              },
              "response": api_rbac_system_roles_roleId_permissions_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/rbac-system/roles/[roleId]/permissions",
                "signature": "api_rbac_system_roles_roleId_permissions_GET"
              }
            },
            "POST": {
              "request": {
                "params": z.object({roleId: z.string()}),
                "body": api_rbac_system_roles_roleId_permissions_POST_body
              },
              "response": api_rbac_system_roles_roleId_permissions_POST_response,
              "metadata": {
                "method": "POST",
                "path": "/api/rbac-system/roles/[roleId]/permissions",
                "signature": "api_rbac_system_roles_roleId_permissions_POST"
              }
            },
            "permissionId": {
              "DELETE": {
                "request": {
                  "params": z.object({roleId: z.string(),permissionId: z.string()})
                },
                "response": api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response,
                "metadata": {
                  "method": "DELETE",
                  "path": "/api/rbac-system/roles/[roleId]/permissions/[permissionId]",
                  "signature": "api_rbac_system_roles_roleId_permissions_permissionId_DELETE"
                }
              },
              "PATCH": {
                "request": {
                  "params": z.object({roleId: z.string(),permissionId: z.string()})
                },
                "response": api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response,
                "metadata": {
                  "method": "PATCH",
                  "path": "/api/rbac-system/roles/[roleId]/permissions/[permissionId]",
                  "signature": "api_rbac_system_roles_roleId_permissions_permissionId_PATCH"
                }
              }
            }
          }
        }
      }
    },
    "team_system": {
      "members": {
        "GET": {
          "request": {
            "query": api_team_system_members_GET_query
          },
          "response": api_team_system_members_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/team-system/members",
            "signature": "api_team_system_members_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_team_system_members_POST_body
          },
          "response": api_team_system_members_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/team-system/members",
            "signature": "api_team_system_members_POST"
          }
        },
        "memberId": {
          "DELETE": {
            "request": {
              "params": z.object({memberId: z.string()})
            },
            "response": api_team_system_members_memberId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/team-system/members/[memberId]",
              "signature": "api_team_system_members_memberId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({memberId: z.string()})
            },
            "response": api_team_system_members_memberId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/team-system/members/[memberId]",
              "signature": "api_team_system_members_memberId_GET"
            }
          }
        }
      },
      "teams": {
        "GET": {
          "request": {
            "query": api_team_system_teams_GET_query
          },
          "response": api_team_system_teams_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/team-system/teams",
            "signature": "api_team_system_teams_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_team_system_teams_POST_body
          },
          "response": api_team_system_teams_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/team-system/teams",
            "signature": "api_team_system_teams_POST"
          }
        },
        "teamId": {
          "DELETE": {
            "request": {
              "params": z.object({teamId: z.string()})
            },
            "response": api_team_system_teams_teamId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/team-system/teams/[teamId]",
              "signature": "api_team_system_teams_teamId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({teamId: z.string()})
            },
            "response": api_team_system_teams_teamId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/team-system/teams/[teamId]",
              "signature": "api_team_system_teams_teamId_GET"
            }
          },
          "members": {
            "GET": {
              "request": {
                "params": z.object({teamId: z.string()}),
                "description": api_team_system_teams_teamId_members_GET_description,
                "query": api_team_system_teams_teamId_members_GET_query
              },
              "response": api_team_system_teams_teamId_members_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/team-system/teams/[teamId]/members",
                "signature": "api_team_system_teams_teamId_members_GET"
              }
            },
            "POST": {
              "request": {
                "params": z.object({teamId: z.string()}),
                "description": api_team_system_teams_teamId_members_POST_description,
                "body": api_team_system_teams_teamId_members_POST_body
              },
              "response": api_team_system_teams_teamId_members_POST_response,
              "metadata": {
                "method": "POST",
                "path": "/api/team-system/teams/[teamId]/members",
                "signature": "api_team_system_teams_teamId_members_POST"
              }
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({teamId: z.string()}),
              "body": api_team_system_teams_teamId_PATCH_body
            },
            "response": api_team_system_teams_teamId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/team-system/teams/[teamId]",
              "signature": "api_team_system_teams_teamId_PATCH"
            }
          }
        }
      }
    },
    "user_resource_system": {
      "achivements": {
        "GET": {
          "request": {
            "query": api_user_resource_system_achivements_GET_query
          },
          "response": api_user_resource_system_achivements_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/user-resource-system/achivements",
            "signature": "api_user_resource_system_achivements_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_user_resource_system_achivements_POST_body
          },
          "response": api_user_resource_system_achivements_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/user-resource-system/achivements",
            "signature": "api_user_resource_system_achivements_POST"
          }
        },
        "projectId": {
          "DELETE": {
            "request": {
              "params": z.object({projectId: z.string()})
            },
            "response": api_user_resource_system_achivements_projectId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/user-resource-system/achivements/[projectId]",
              "signature": "api_user_resource_system_achivements_projectId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "query": api_user_resource_system_achivements_projectId_GET_query
            },
            "response": api_user_resource_system_achivements_projectId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/user-resource-system/achivements/[projectId]",
              "signature": "api_user_resource_system_achivements_projectId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "body": api_user_resource_system_achivements_projectId_PATCH_body
            },
            "response": api_user_resource_system_achivements_projectId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/user-resource-system/achivements/[projectId]",
              "signature": "api_user_resource_system_achivements_projectId_PATCH"
            }
          }
        }
      },
      "certificates": {
        "GET": {
          "request": {
            "query": api_user_resource_system_certificates_GET_query
          },
          "response": api_user_resource_system_certificates_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/user-resource-system/certificates",
            "signature": "api_user_resource_system_certificates_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_user_resource_system_certificates_POST_body
          },
          "response": api_user_resource_system_certificates_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/user-resource-system/certificates",
            "signature": "api_user_resource_system_certificates_POST"
          }
        },
        "projectId": {
          "DELETE": {
            "request": {
              "params": z.object({projectId: z.string()})
            },
            "response": api_user_resource_system_certificates_projectId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/user-resource-system/certificates/[projectId]",
              "signature": "api_user_resource_system_certificates_projectId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "query": api_user_resource_system_certificates_projectId_GET_query
            },
            "response": api_user_resource_system_certificates_projectId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/user-resource-system/certificates/[projectId]",
              "signature": "api_user_resource_system_certificates_projectId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "body": api_user_resource_system_certificates_projectId_PATCH_body
            },
            "response": api_user_resource_system_certificates_projectId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/user-resource-system/certificates/[projectId]",
              "signature": "api_user_resource_system_certificates_projectId_PATCH"
            }
          }
        }
      },
      "profiles": {
        "GET": {
          "request": {
            "query": api_user_resource_system_profiles_GET_query
          },
          "response": api_user_resource_system_profiles_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/user-resource-system/profiles",
            "signature": "api_user_resource_system_profiles_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_user_resource_system_profiles_POST_body
          },
          "response": api_user_resource_system_profiles_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/user-resource-system/profiles",
            "signature": "api_user_resource_system_profiles_POST"
          }
        },
        "projectId": {
          "DELETE": {
            "request": {
              "params": z.object({projectId: z.string()})
            },
            "response": api_user_resource_system_profiles_projectId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/user-resource-system/profiles/[projectId]",
              "signature": "api_user_resource_system_profiles_projectId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "query": api_user_resource_system_profiles_projectId_GET_query
            },
            "response": api_user_resource_system_profiles_projectId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/user-resource-system/profiles/[projectId]",
              "signature": "api_user_resource_system_profiles_projectId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "body": api_user_resource_system_profiles_projectId_PATCH_body
            },
            "response": api_user_resource_system_profiles_projectId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/user-resource-system/profiles/[projectId]",
              "signature": "api_user_resource_system_profiles_projectId_PATCH"
            }
          }
        }
      },
      "projects": {
        "GET": {
          "request": {
            "query": api_user_resource_system_projects_GET_query
          },
          "response": api_user_resource_system_projects_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/user-resource-system/projects",
            "signature": "api_user_resource_system_projects_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_user_resource_system_projects_POST_body
          },
          "response": api_user_resource_system_projects_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/user-resource-system/projects",
            "signature": "api_user_resource_system_projects_POST"
          }
        },
        "projectId": {
          "DELETE": {
            "request": {
              "params": z.object({projectId: z.string()})
            },
            "response": api_user_resource_system_projects_projectId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/user-resource-system/projects/[projectId]",
              "signature": "api_user_resource_system_projects_projectId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "query": api_user_resource_system_projects_projectId_GET_query
            },
            "response": api_user_resource_system_projects_projectId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/user-resource-system/projects/[projectId]",
              "signature": "api_user_resource_system_projects_projectId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "body": api_user_resource_system_projects_projectId_PATCH_body
            },
            "response": api_user_resource_system_projects_projectId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/user-resource-system/projects/[projectId]",
              "signature": "api_user_resource_system_projects_projectId_PATCH"
            }
          }
        }
      },
      "settings": {
        "GET": {
          "request": {
            "query": api_user_resource_system_settings_GET_query
          },
          "response": api_user_resource_system_settings_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/user-resource-system/settings",
            "signature": "api_user_resource_system_settings_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_user_resource_system_settings_POST_body
          },
          "response": api_user_resource_system_settings_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/user-resource-system/settings",
            "signature": "api_user_resource_system_settings_POST"
          }
        },
        "projectId": {
          "DELETE": {
            "request": {
              "params": z.object({projectId: z.string()})
            },
            "response": api_user_resource_system_settings_projectId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/user-resource-system/settings/[projectId]",
              "signature": "api_user_resource_system_settings_projectId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "query": api_user_resource_system_settings_projectId_GET_query
            },
            "response": api_user_resource_system_settings_projectId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/user-resource-system/settings/[projectId]",
              "signature": "api_user_resource_system_settings_projectId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({projectId: z.string()}),
              "body": api_user_resource_system_settings_projectId_PATCH_body
            },
            "response": api_user_resource_system_settings_projectId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/user-resource-system/settings/[projectId]",
              "signature": "api_user_resource_system_settings_projectId_PATCH"
            }
          }
        }
      },
      "users": {
        "userId": {
          "GET": {
            "request": {
              "params": z.object({userId: z.string()})
            },
            "response": api_user_resource_system_users_userId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/user-resource-system/users/[userId]",
              "signature": "api_user_resource_system_users_userId_GET"
            }
          },
          "profile": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()})
              },
              "response": api_user_resource_system_users_userId_profile_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-resource-system/users/[userId]/profile",
                "signature": "api_user_resource_system_users_userId_profile_GET"
              }
            }
          },
          "projects": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()}),
                "query": api_user_resource_system_users_userId_projects_GET_query
              },
              "response": api_user_resource_system_users_userId_projects_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-resource-system/users/[userId]/projects",
                "signature": "api_user_resource_system_users_userId_projects_GET"
              }
            }
          },
          "roles": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()})
              },
              "response": api_user_resource_system_users_userId_roles_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-resource-system/users/[userId]/roles",
                "signature": "api_user_resource_system_users_userId_roles_GET"
              }
            }
          },
          "wallet": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()})
              },
              "response": api_user_resource_system_users_userId_wallet_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-resource-system/users/[userId]/wallet",
                "signature": "api_user_resource_system_users_userId_wallet_GET"
              }
            },
            "transactions": {
              "GET": {
                "request": {
                  "params": z.object({userId: z.string()}),
                  "query": api_user_resource_system_users_userId_wallet_transactions_GET_query
                },
                "response": api_user_resource_system_users_userId_wallet_transactions_GET_response,
                "metadata": {
                  "method": "GET",
                  "path": "/api/user-resource-system/users/[userId]/wallet/transactions",
                  "signature": "api_user_resource_system_users_userId_wallet_transactions_GET"
                }
              }
            }
          }
        }
      }
    },
    "user_system": {
      "users": {
        "userId": {
          "GET": {
            "request": {
              "params": z.object({userId: z.string()})
            },
            "response": api_user_system_users_userId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/user-system/users/[userId]",
              "signature": "api_user_system_users_userId_GET"
            }
          },
          "profile": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()})
              },
              "response": api_user_system_users_userId_profile_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-system/users/[userId]/profile",
                "signature": "api_user_system_users_userId_profile_GET"
              }
            }
          },
          "projects": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()}),
                "query": api_user_system_users_userId_projects_GET_query
              },
              "response": api_user_system_users_userId_projects_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-system/users/[userId]/projects",
                "signature": "api_user_system_users_userId_projects_GET"
              }
            }
          },
          "roles": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()})
              },
              "response": api_user_system_users_userId_roles_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-system/users/[userId]/roles",
                "signature": "api_user_system_users_userId_roles_GET"
              }
            }
          },
          "wallet": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()})
              },
              "response": api_user_system_users_userId_wallet_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-system/users/[userId]/wallet",
                "signature": "api_user_system_users_userId_wallet_GET"
              }
            },
            "transactions": {
              "GET": {
                "request": {
                  "params": z.object({userId: z.string()}),
                  "query": api_user_system_users_userId_wallet_transactions_GET_query
                },
                "response": api_user_system_users_userId_wallet_transactions_GET_response,
                "metadata": {
                  "method": "GET",
                  "path": "/api/user-system/users/[userId]/wallet/transactions",
                  "signature": "api_user_system_users_userId_wallet_transactions_GET"
                }
              }
            }
          }
        }
      }
    }
  }
}

export namespace contract {
  export namespace api {
    export namespace article_system {
      export namespace articles {
        export namespace articleId {
          export namespace comments {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
                export type query = z.infer<typeof api_article_system_articles_articleId_comments_GET_query>;
              }
              export type response = { [K in keyof typeof api_article_system_articles_articleId_comments_GET_response]: z.infer<(typeof api_article_system_articles_articleId_comments_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/article-system/articles/[articleId]/comments";
                export type signature = "api_article_system_articles_articleId_comments_GET";
              }
            }
            export namespace POST {
              export namespace request {
                export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
                export type body = z.infer<typeof api_article_system_articles_articleId_comments_POST_body>;
              }
              export type response = { [K in keyof typeof api_article_system_articles_articleId_comments_POST_response]: z.infer<(typeof api_article_system_articles_articleId_comments_POST_response)[K]> };
              export namespace metadata {
                export type method = "POST";
                export type path = "/api/article-system/articles/[articleId]/comments";
                export type signature = "api_article_system_articles_articleId_comments_POST";
              }
            }
            export namespace commentId {
              export namespace DELETE {
                export namespace request {
                  export type params = z.infer<z.ZodObject<{articleId: z.ZodString,commentId: z.ZodString}>>;
                }
                export type response = { [K in keyof typeof api_article_system_articles_articleId_comments_commentId_DELETE_response]: z.infer<(typeof api_article_system_articles_articleId_comments_commentId_DELETE_response)[K]> };
                export namespace metadata {
                  export type method = "DELETE";
                  export type path = "/api/article-system/articles/[articleId]/comments/[commentId]";
                  export type signature = "api_article_system_articles_articleId_comments_commentId_DELETE";
                }
              }
            }
          }
        }
      }
    }
    export namespace event_system {
      export namespace checkin {
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_event_system_checkin_POST_body>;
          }
          export type response = { [K in keyof typeof api_event_system_checkin_POST_response]: z.infer<(typeof api_event_system_checkin_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/event-system/checkin";
            export type signature = "api_event_system_checkin_POST";
          }
        }
      }
      export namespace events {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_event_system_events_GET_query>;
          }
          export type response = { [K in keyof typeof api_event_system_events_GET_response]: z.infer<(typeof api_event_system_events_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/event-system/events";
            export type signature = "api_event_system_events_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_event_system_events_POST_body>;
          }
          export type response = { [K in keyof typeof api_event_system_events_POST_response]: z.infer<(typeof api_event_system_events_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/event-system/events";
            export type signature = "api_event_system_events_POST";
          }
        }
        export namespace eventId {
          export namespace attendees {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{eventId: z.ZodString}>>;
                export type query = z.infer<typeof api_event_system_events_eventId_attendees_GET_query>;
              }
              export type response = { [K in keyof typeof api_event_system_events_eventId_attendees_GET_response]: z.infer<(typeof api_event_system_events_eventId_attendees_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/event-system/events/[eventId]/attendees";
                export type signature = "api_event_system_events_eventId_attendees_GET";
              }
            }
          }
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{eventId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_event_system_events_eventId_DELETE_response]: z.infer<(typeof api_event_system_events_eventId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/event-system/events/[eventId]";
              export type signature = "api_event_system_events_eventId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{eventId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_event_system_events_eventId_GET_response]: z.infer<(typeof api_event_system_events_eventId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/event-system/events/[eventId]";
              export type signature = "api_event_system_events_eventId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{eventId: z.ZodString}>>;
              export type body = z.infer<typeof api_event_system_events_eventId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_event_system_events_eventId_PATCH_response]: z.infer<(typeof api_event_system_events_eventId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/event-system/events/[eventId]";
              export type signature = "api_event_system_events_eventId_PATCH";
            }
          }
        }
      }
    }
    export namespace file_system {
      export namespace files {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_file_system_files_GET_query>;
          }
          export type response = { [K in keyof typeof api_file_system_files_GET_response]: z.infer<(typeof api_file_system_files_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/file-system/files";
            export type signature = "api_file_system_files_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_file_system_files_POST_body>;
          }
          export type response = { [K in keyof typeof api_file_system_files_POST_response]: z.infer<(typeof api_file_system_files_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/file-system/files";
            export type signature = "api_file_system_files_POST";
          }
        }
        export namespace fileId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{fileId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_file_system_files_fileId_DELETE_response]: z.infer<(typeof api_file_system_files_fileId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/file-system/files/[fileId]";
              export type signature = "api_file_system_files_fileId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{fileId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_file_system_files_fileId_GET_response]: z.infer<(typeof api_file_system_files_fileId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/file-system/files/[fileId]";
              export type signature = "api_file_system_files_fileId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{fileId: z.ZodString}>>;
              export type body = z.infer<typeof api_file_system_files_fileId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_file_system_files_fileId_PATCH_response]: z.infer<(typeof api_file_system_files_fileId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/file-system/files/[fileId]";
              export type signature = "api_file_system_files_fileId_PATCH";
            }
          }
        }
      }
    }
    export namespace health {
      export namespace GET {
        export namespace request {

        }
        export type response = { [K in keyof typeof api_health_GET_response]: z.infer<(typeof api_health_GET_response)[K]> };
        export namespace metadata {
          export type method = "GET";
          export type path = "/api/health";
          export type signature = "api_health_GET";
        }
      }
    }
    export namespace leaderboard_system {
      export namespace GET {
        export namespace request {

        }
        export type response = { [K in keyof typeof api_leaderboard_system_GET_response]: z.infer<(typeof api_leaderboard_system_GET_response)[K]> };
        export namespace metadata {
          export type method = "GET";
          export type path = "/api/leaderboard-system";
          export type signature = "api_leaderboard_system_GET";
        }
      }
    }
    export namespace learning_resource_system {
      export namespace externalResources {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_learning_resource_system_externalResources_GET_query>;
          }
          export type response = { [K in keyof typeof api_learning_resource_system_externalResources_GET_response]: z.infer<(typeof api_learning_resource_system_externalResources_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/learning-resource-system/externalResources";
            export type signature = "api_learning_resource_system_externalResources_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_learning_resource_system_externalResources_POST_body>;
          }
          export type response = { [K in keyof typeof api_learning_resource_system_externalResources_POST_response]: z.infer<(typeof api_learning_resource_system_externalResources_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/learning-resource-system/externalResources";
            export type signature = "api_learning_resource_system_externalResources_POST";
          }
        }
        export namespace externalResourceId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{externalResourceId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_learning_resource_system_externalResources_externalResourceId_DELETE_response]: z.infer<(typeof api_learning_resource_system_externalResources_externalResourceId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/learning-resource-system/externalResources/[externalResourceId]";
              export type signature = "api_learning_resource_system_externalResources_externalResourceId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{externalResourceId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_learning_resource_system_externalResources_externalResourceId_GET_response]: z.infer<(typeof api_learning_resource_system_externalResources_externalResourceId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/learning-resource-system/externalResources/[externalResourceId]";
              export type signature = "api_learning_resource_system_externalResources_externalResourceId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{externalResourceId: z.ZodString}>>;
              export type body = z.infer<typeof api_learning_resource_system_externalResources_externalResourceId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_learning_resource_system_externalResources_externalResourceId_PATCH_response]: z.infer<(typeof api_learning_resource_system_externalResources_externalResourceId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/learning-resource-system/externalResources/[externalResourceId]";
              export type signature = "api_learning_resource_system_externalResources_externalResourceId_PATCH";
            }
          }
        }
      }
      export namespace GET {
        export namespace request {
          export type query = z.infer<typeof api_learning_resource_system_GET_query>;
        }
        export type response = { [K in keyof typeof api_learning_resource_system_GET_response]: z.infer<(typeof api_learning_resource_system_GET_response)[K]> };
        export namespace metadata {
          export type method = "GET";
          export type path = "/api/learning-resource-system";
          export type signature = "api_learning_resource_system_GET";
        }
      }
      export namespace study_jams {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_learning_resource_system_study_jams_GET_query>;
          }
          export type response = { [K in keyof typeof api_learning_resource_system_study_jams_GET_response]: z.infer<(typeof api_learning_resource_system_study_jams_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/learning-resource-system/study-jams";
            export type signature = "api_learning_resource_system_study_jams_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_learning_resource_system_study_jams_POST_body>;
          }
          export type response = { [K in keyof typeof api_learning_resource_system_study_jams_POST_response]: z.infer<(typeof api_learning_resource_system_study_jams_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/learning-resource-system/study-jams";
            export type signature = "api_learning_resource_system_study_jams_POST";
          }
        }
        export namespace studyJamId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{studyJamId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_DELETE_response]: z.infer<(typeof api_learning_resource_system_study_jams_studyJamId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/learning-resource-system/study-jams/[studyJamId]";
              export type signature = "api_learning_resource_system_study_jams_studyJamId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{studyJamId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_GET_response]: z.infer<(typeof api_learning_resource_system_study_jams_studyJamId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/learning-resource-system/study-jams/[studyJamId]";
              export type signature = "api_learning_resource_system_study_jams_studyJamId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{studyJamId: z.ZodString}>>;
              export type body = z.infer<typeof api_learning_resource_system_study_jams_studyJamId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_PATCH_response]: z.infer<(typeof api_learning_resource_system_study_jams_studyJamId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/learning-resource-system/study-jams/[studyJamId]";
              export type signature = "api_learning_resource_system_study_jams_studyJamId_PATCH";
            }
          }
        }
      }
    }
    export namespace publication_system {
      export namespace articles {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_publication_system_articles_GET_query>;
          }
          export type response = { [K in keyof typeof api_publication_system_articles_GET_response]: z.infer<(typeof api_publication_system_articles_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/publication-system/articles";
            export type signature = "api_publication_system_articles_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_publication_system_articles_POST_body>;
          }
          export type response = { [K in keyof typeof api_publication_system_articles_POST_response]: z.infer<(typeof api_publication_system_articles_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/publication-system/articles";
            export type signature = "api_publication_system_articles_POST";
          }
        }
        export namespace articleId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_publication_system_articles_articleId_DELETE_response]: z.infer<(typeof api_publication_system_articles_articleId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/publication-system/articles/[articleId]";
              export type signature = "api_publication_system_articles_articleId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_publication_system_articles_articleId_GET_response]: z.infer<(typeof api_publication_system_articles_articleId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/publication-system/articles/[articleId]";
              export type signature = "api_publication_system_articles_articleId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
              export type body = z.infer<typeof api_publication_system_articles_articleId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_publication_system_articles_articleId_PATCH_response]: z.infer<(typeof api_publication_system_articles_articleId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/publication-system/articles/[articleId]";
              export type signature = "api_publication_system_articles_articleId_PATCH";
            }
          }
        }
      }
      export namespace events {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_publication_system_events_GET_query>;
          }
          export type response = { [K in keyof typeof api_publication_system_events_GET_response]: z.infer<(typeof api_publication_system_events_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/publication-system/events";
            export type signature = "api_publication_system_events_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_publication_system_events_POST_body>;
          }
          export type response = { [K in keyof typeof api_publication_system_events_POST_response]: z.infer<(typeof api_publication_system_events_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/publication-system/events";
            export type signature = "api_publication_system_events_POST";
          }
        }
        export namespace articleId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_publication_system_events_articleId_DELETE_response]: z.infer<(typeof api_publication_system_events_articleId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/publication-system/events/[articleId]";
              export type signature = "api_publication_system_events_articleId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_publication_system_events_articleId_GET_response]: z.infer<(typeof api_publication_system_events_articleId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/publication-system/events/[articleId]";
              export type signature = "api_publication_system_events_articleId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
              export type body = z.infer<typeof api_publication_system_events_articleId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_publication_system_events_articleId_PATCH_response]: z.infer<(typeof api_publication_system_events_articleId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/publication-system/events/[articleId]";
              export type signature = "api_publication_system_events_articleId_PATCH";
            }
          }
        }
      }
      export namespace highlights {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_publication_system_highlights_GET_query>;
          }
          export type response = { [K in keyof typeof api_publication_system_highlights_GET_response]: z.infer<(typeof api_publication_system_highlights_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/publication-system/highlights";
            export type signature = "api_publication_system_highlights_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_publication_system_highlights_POST_body>;
          }
          export type response = { [K in keyof typeof api_publication_system_highlights_POST_response]: z.infer<(typeof api_publication_system_highlights_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/publication-system/highlights";
            export type signature = "api_publication_system_highlights_POST";
          }
        }
        export namespace articleId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_publication_system_highlights_articleId_DELETE_response]: z.infer<(typeof api_publication_system_highlights_articleId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/publication-system/highlights/[articleId]";
              export type signature = "api_publication_system_highlights_articleId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_publication_system_highlights_articleId_GET_response]: z.infer<(typeof api_publication_system_highlights_articleId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/publication-system/highlights/[articleId]";
              export type signature = "api_publication_system_highlights_articleId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{articleId: z.ZodString}>>;
              export type body = z.infer<typeof api_publication_system_highlights_articleId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_publication_system_highlights_articleId_PATCH_response]: z.infer<(typeof api_publication_system_highlights_articleId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/publication-system/highlights/[articleId]";
              export type signature = "api_publication_system_highlights_articleId_PATCH";
            }
          }
        }
      }
    }
    export namespace rbac_system {
      export namespace roles {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_rbac_system_roles_GET_query>;
          }
          export type response = { [K in keyof typeof api_rbac_system_roles_GET_response]: z.infer<(typeof api_rbac_system_roles_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/rbac-system/roles";
            export type signature = "api_rbac_system_roles_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_rbac_system_roles_POST_body>;
          }
          export type response = { [K in keyof typeof api_rbac_system_roles_POST_response]: z.infer<(typeof api_rbac_system_roles_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/rbac-system/roles";
            export type signature = "api_rbac_system_roles_POST";
          }
        }
        export namespace roleId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{roleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_rbac_system_roles_roleId_DELETE_response]: z.infer<(typeof api_rbac_system_roles_roleId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/rbac-system/roles/[roleId]";
              export type signature = "api_rbac_system_roles_roleId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{roleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_rbac_system_roles_roleId_GET_response]: z.infer<(typeof api_rbac_system_roles_roleId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/rbac-system/roles/[roleId]";
              export type signature = "api_rbac_system_roles_roleId_GET";
            }
          }
          export namespace parent {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{roleId: z.ZodString}>>;
              }
              export type response = { [K in keyof typeof api_rbac_system_roles_roleId_parent_GET_response]: z.infer<(typeof api_rbac_system_roles_roleId_parent_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/rbac-system/roles/[roleId]/parent";
                export type signature = "api_rbac_system_roles_roleId_parent_GET";
              }
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{roleId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_rbac_system_roles_roleId_PATCH_response]: z.infer<(typeof api_rbac_system_roles_roleId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/rbac-system/roles/[roleId]";
              export type signature = "api_rbac_system_roles_roleId_PATCH";
            }
          }
          export namespace permissions {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{roleId: z.ZodString}>>;
                export type description = z.infer<typeof api_rbac_system_roles_roleId_permissions_GET_description>;
                export type query = z.infer<typeof api_rbac_system_roles_roleId_permissions_GET_query>;
              }
              export type response = { [K in keyof typeof api_rbac_system_roles_roleId_permissions_GET_response]: z.infer<(typeof api_rbac_system_roles_roleId_permissions_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/rbac-system/roles/[roleId]/permissions";
                export type signature = "api_rbac_system_roles_roleId_permissions_GET";
              }
            }
            export namespace POST {
              export namespace request {
                export type params = z.infer<z.ZodObject<{roleId: z.ZodString}>>;
                export type body = z.infer<typeof api_rbac_system_roles_roleId_permissions_POST_body>;
              }
              export type response = { [K in keyof typeof api_rbac_system_roles_roleId_permissions_POST_response]: z.infer<(typeof api_rbac_system_roles_roleId_permissions_POST_response)[K]> };
              export namespace metadata {
                export type method = "POST";
                export type path = "/api/rbac-system/roles/[roleId]/permissions";
                export type signature = "api_rbac_system_roles_roleId_permissions_POST";
              }
            }
            export namespace permissionId {
              export namespace DELETE {
                export namespace request {
                  export type params = z.infer<z.ZodObject<{roleId: z.ZodString,permissionId: z.ZodString}>>;
                }
                export type response = { [K in keyof typeof api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response]: z.infer<(typeof api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response)[K]> };
                export namespace metadata {
                  export type method = "DELETE";
                  export type path = "/api/rbac-system/roles/[roleId]/permissions/[permissionId]";
                  export type signature = "api_rbac_system_roles_roleId_permissions_permissionId_DELETE";
                }
              }
              export namespace PATCH {
                export namespace request {
                  export type params = z.infer<z.ZodObject<{roleId: z.ZodString,permissionId: z.ZodString}>>;
                }
                export type response = { [K in keyof typeof api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response]: z.infer<(typeof api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response)[K]> };
                export namespace metadata {
                  export type method = "PATCH";
                  export type path = "/api/rbac-system/roles/[roleId]/permissions/[permissionId]";
                  export type signature = "api_rbac_system_roles_roleId_permissions_permissionId_PATCH";
                }
              }
            }
          }
        }
      }
    }
    export namespace team_system {
      export namespace members {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_team_system_members_GET_query>;
          }
          export type response = { [K in keyof typeof api_team_system_members_GET_response]: z.infer<(typeof api_team_system_members_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/team-system/members";
            export type signature = "api_team_system_members_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_team_system_members_POST_body>;
          }
          export type response = { [K in keyof typeof api_team_system_members_POST_response]: z.infer<(typeof api_team_system_members_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/team-system/members";
            export type signature = "api_team_system_members_POST";
          }
        }
        export namespace memberId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{memberId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_team_system_members_memberId_DELETE_response]: z.infer<(typeof api_team_system_members_memberId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/team-system/members/[memberId]";
              export type signature = "api_team_system_members_memberId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{memberId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_team_system_members_memberId_GET_response]: z.infer<(typeof api_team_system_members_memberId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/team-system/members/[memberId]";
              export type signature = "api_team_system_members_memberId_GET";
            }
          }
        }
      }
      export namespace teams {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_team_system_teams_GET_query>;
          }
          export type response = { [K in keyof typeof api_team_system_teams_GET_response]: z.infer<(typeof api_team_system_teams_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/team-system/teams";
            export type signature = "api_team_system_teams_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_team_system_teams_POST_body>;
          }
          export type response = { [K in keyof typeof api_team_system_teams_POST_response]: z.infer<(typeof api_team_system_teams_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/team-system/teams";
            export type signature = "api_team_system_teams_POST";
          }
        }
        export namespace teamId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{teamId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_team_system_teams_teamId_DELETE_response]: z.infer<(typeof api_team_system_teams_teamId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/team-system/teams/[teamId]";
              export type signature = "api_team_system_teams_teamId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{teamId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_team_system_teams_teamId_GET_response]: z.infer<(typeof api_team_system_teams_teamId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/team-system/teams/[teamId]";
              export type signature = "api_team_system_teams_teamId_GET";
            }
          }
          export namespace members {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{teamId: z.ZodString}>>;
                export type description = z.infer<typeof api_team_system_teams_teamId_members_GET_description>;
                export type query = z.infer<typeof api_team_system_teams_teamId_members_GET_query>;
              }
              export type response = { [K in keyof typeof api_team_system_teams_teamId_members_GET_response]: z.infer<(typeof api_team_system_teams_teamId_members_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/team-system/teams/[teamId]/members";
                export type signature = "api_team_system_teams_teamId_members_GET";
              }
            }
            export namespace POST {
              export namespace request {
                export type params = z.infer<z.ZodObject<{teamId: z.ZodString}>>;
                export type description = z.infer<typeof api_team_system_teams_teamId_members_POST_description>;
                export type body = z.infer<typeof api_team_system_teams_teamId_members_POST_body>;
              }
              export type response = { [K in keyof typeof api_team_system_teams_teamId_members_POST_response]: z.infer<(typeof api_team_system_teams_teamId_members_POST_response)[K]> };
              export namespace metadata {
                export type method = "POST";
                export type path = "/api/team-system/teams/[teamId]/members";
                export type signature = "api_team_system_teams_teamId_members_POST";
              }
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{teamId: z.ZodString}>>;
              export type body = z.infer<typeof api_team_system_teams_teamId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_team_system_teams_teamId_PATCH_response]: z.infer<(typeof api_team_system_teams_teamId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/team-system/teams/[teamId]";
              export type signature = "api_team_system_teams_teamId_PATCH";
            }
          }
        }
      }
    }
    export namespace user_resource_system {
      export namespace achivements {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_user_resource_system_achivements_GET_query>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_achivements_GET_response]: z.infer<(typeof api_user_resource_system_achivements_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/user-resource-system/achivements";
            export type signature = "api_user_resource_system_achivements_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_user_resource_system_achivements_POST_body>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_achivements_POST_response]: z.infer<(typeof api_user_resource_system_achivements_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/user-resource-system/achivements";
            export type signature = "api_user_resource_system_achivements_POST";
          }
        }
        export namespace projectId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_achivements_projectId_DELETE_response]: z.infer<(typeof api_user_resource_system_achivements_projectId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/user-resource-system/achivements/[projectId]";
              export type signature = "api_user_resource_system_achivements_projectId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type query = z.infer<typeof api_user_resource_system_achivements_projectId_GET_query>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_achivements_projectId_GET_response]: z.infer<(typeof api_user_resource_system_achivements_projectId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/user-resource-system/achivements/[projectId]";
              export type signature = "api_user_resource_system_achivements_projectId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type body = z.infer<typeof api_user_resource_system_achivements_projectId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_achivements_projectId_PATCH_response]: z.infer<(typeof api_user_resource_system_achivements_projectId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/user-resource-system/achivements/[projectId]";
              export type signature = "api_user_resource_system_achivements_projectId_PATCH";
            }
          }
        }
      }
      export namespace certificates {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_user_resource_system_certificates_GET_query>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_certificates_GET_response]: z.infer<(typeof api_user_resource_system_certificates_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/user-resource-system/certificates";
            export type signature = "api_user_resource_system_certificates_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_user_resource_system_certificates_POST_body>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_certificates_POST_response]: z.infer<(typeof api_user_resource_system_certificates_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/user-resource-system/certificates";
            export type signature = "api_user_resource_system_certificates_POST";
          }
        }
        export namespace projectId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_certificates_projectId_DELETE_response]: z.infer<(typeof api_user_resource_system_certificates_projectId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/user-resource-system/certificates/[projectId]";
              export type signature = "api_user_resource_system_certificates_projectId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type query = z.infer<typeof api_user_resource_system_certificates_projectId_GET_query>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_certificates_projectId_GET_response]: z.infer<(typeof api_user_resource_system_certificates_projectId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/user-resource-system/certificates/[projectId]";
              export type signature = "api_user_resource_system_certificates_projectId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type body = z.infer<typeof api_user_resource_system_certificates_projectId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_certificates_projectId_PATCH_response]: z.infer<(typeof api_user_resource_system_certificates_projectId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/user-resource-system/certificates/[projectId]";
              export type signature = "api_user_resource_system_certificates_projectId_PATCH";
            }
          }
        }
      }
      export namespace profiles {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_user_resource_system_profiles_GET_query>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_profiles_GET_response]: z.infer<(typeof api_user_resource_system_profiles_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/user-resource-system/profiles";
            export type signature = "api_user_resource_system_profiles_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_user_resource_system_profiles_POST_body>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_profiles_POST_response]: z.infer<(typeof api_user_resource_system_profiles_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/user-resource-system/profiles";
            export type signature = "api_user_resource_system_profiles_POST";
          }
        }
        export namespace projectId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_profiles_projectId_DELETE_response]: z.infer<(typeof api_user_resource_system_profiles_projectId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/user-resource-system/profiles/[projectId]";
              export type signature = "api_user_resource_system_profiles_projectId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type query = z.infer<typeof api_user_resource_system_profiles_projectId_GET_query>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_profiles_projectId_GET_response]: z.infer<(typeof api_user_resource_system_profiles_projectId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/user-resource-system/profiles/[projectId]";
              export type signature = "api_user_resource_system_profiles_projectId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type body = z.infer<typeof api_user_resource_system_profiles_projectId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_profiles_projectId_PATCH_response]: z.infer<(typeof api_user_resource_system_profiles_projectId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/user-resource-system/profiles/[projectId]";
              export type signature = "api_user_resource_system_profiles_projectId_PATCH";
            }
          }
        }
      }
      export namespace projects {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_user_resource_system_projects_GET_query>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_projects_GET_response]: z.infer<(typeof api_user_resource_system_projects_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/user-resource-system/projects";
            export type signature = "api_user_resource_system_projects_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_user_resource_system_projects_POST_body>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_projects_POST_response]: z.infer<(typeof api_user_resource_system_projects_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/user-resource-system/projects";
            export type signature = "api_user_resource_system_projects_POST";
          }
        }
        export namespace projectId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_projects_projectId_DELETE_response]: z.infer<(typeof api_user_resource_system_projects_projectId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/user-resource-system/projects/[projectId]";
              export type signature = "api_user_resource_system_projects_projectId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type query = z.infer<typeof api_user_resource_system_projects_projectId_GET_query>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_projects_projectId_GET_response]: z.infer<(typeof api_user_resource_system_projects_projectId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/user-resource-system/projects/[projectId]";
              export type signature = "api_user_resource_system_projects_projectId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type body = z.infer<typeof api_user_resource_system_projects_projectId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_projects_projectId_PATCH_response]: z.infer<(typeof api_user_resource_system_projects_projectId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/user-resource-system/projects/[projectId]";
              export type signature = "api_user_resource_system_projects_projectId_PATCH";
            }
          }
        }
      }
      export namespace settings {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_user_resource_system_settings_GET_query>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_settings_GET_response]: z.infer<(typeof api_user_resource_system_settings_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/user-resource-system/settings";
            export type signature = "api_user_resource_system_settings_GET";
          }
        }
        export namespace POST {
          export namespace request {
            export type body = z.infer<typeof api_user_resource_system_settings_POST_body>;
          }
          export type response = { [K in keyof typeof api_user_resource_system_settings_POST_response]: z.infer<(typeof api_user_resource_system_settings_POST_response)[K]> };
          export namespace metadata {
            export type method = "POST";
            export type path = "/api/user-resource-system/settings";
            export type signature = "api_user_resource_system_settings_POST";
          }
        }
        export namespace projectId {
          export namespace DELETE {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_settings_projectId_DELETE_response]: z.infer<(typeof api_user_resource_system_settings_projectId_DELETE_response)[K]> };
            export namespace metadata {
              export type method = "DELETE";
              export type path = "/api/user-resource-system/settings/[projectId]";
              export type signature = "api_user_resource_system_settings_projectId_DELETE";
            }
          }
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type query = z.infer<typeof api_user_resource_system_settings_projectId_GET_query>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_settings_projectId_GET_response]: z.infer<(typeof api_user_resource_system_settings_projectId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/user-resource-system/settings/[projectId]";
              export type signature = "api_user_resource_system_settings_projectId_GET";
            }
          }
          export namespace PATCH {
            export namespace request {
              export type params = z.infer<z.ZodObject<{projectId: z.ZodString}>>;
              export type body = z.infer<typeof api_user_resource_system_settings_projectId_PATCH_body>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_settings_projectId_PATCH_response]: z.infer<(typeof api_user_resource_system_settings_projectId_PATCH_response)[K]> };
            export namespace metadata {
              export type method = "PATCH";
              export type path = "/api/user-resource-system/settings/[projectId]";
              export type signature = "api_user_resource_system_settings_projectId_PATCH";
            }
          }
        }
      }
      export namespace users {
        export namespace userId {
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_user_resource_system_users_userId_GET_response]: z.infer<(typeof api_user_resource_system_users_userId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/user-resource-system/users/[userId]";
              export type signature = "api_user_resource_system_users_userId_GET";
            }
          }
          export namespace profile {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
              }
              export type response = { [K in keyof typeof api_user_resource_system_users_userId_profile_GET_response]: z.infer<(typeof api_user_resource_system_users_userId_profile_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-resource-system/users/[userId]/profile";
                export type signature = "api_user_resource_system_users_userId_profile_GET";
              }
            }
          }
          export namespace projects {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
                export type query = z.infer<typeof api_user_resource_system_users_userId_projects_GET_query>;
              }
              export type response = { [K in keyof typeof api_user_resource_system_users_userId_projects_GET_response]: z.infer<(typeof api_user_resource_system_users_userId_projects_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-resource-system/users/[userId]/projects";
                export type signature = "api_user_resource_system_users_userId_projects_GET";
              }
            }
          }
          export namespace roles {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
              }
              export type response = { [K in keyof typeof api_user_resource_system_users_userId_roles_GET_response]: z.infer<(typeof api_user_resource_system_users_userId_roles_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-resource-system/users/[userId]/roles";
                export type signature = "api_user_resource_system_users_userId_roles_GET";
              }
            }
          }
          export namespace wallet {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
              }
              export type response = { [K in keyof typeof api_user_resource_system_users_userId_wallet_GET_response]: z.infer<(typeof api_user_resource_system_users_userId_wallet_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-resource-system/users/[userId]/wallet";
                export type signature = "api_user_resource_system_users_userId_wallet_GET";
              }
            }
            export namespace transactions {
              export namespace GET {
                export namespace request {
                  export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
                  export type query = z.infer<typeof api_user_resource_system_users_userId_wallet_transactions_GET_query>;
                }
                export type response = { [K in keyof typeof api_user_resource_system_users_userId_wallet_transactions_GET_response]: z.infer<(typeof api_user_resource_system_users_userId_wallet_transactions_GET_response)[K]> };
                export namespace metadata {
                  export type method = "GET";
                  export type path = "/api/user-resource-system/users/[userId]/wallet/transactions";
                  export type signature = "api_user_resource_system_users_userId_wallet_transactions_GET";
                }
              }
            }
          }
        }
      }
    }
    export namespace user_system {
      export namespace users {
        export namespace userId {
          export namespace GET {
            export namespace request {
              export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
            }
            export type response = { [K in keyof typeof api_user_system_users_userId_GET_response]: z.infer<(typeof api_user_system_users_userId_GET_response)[K]> };
            export namespace metadata {
              export type method = "GET";
              export type path = "/api/user-system/users/[userId]";
              export type signature = "api_user_system_users_userId_GET";
            }
          }
          export namespace profile {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
              }
              export type response = { [K in keyof typeof api_user_system_users_userId_profile_GET_response]: z.infer<(typeof api_user_system_users_userId_profile_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-system/users/[userId]/profile";
                export type signature = "api_user_system_users_userId_profile_GET";
              }
            }
          }
          export namespace projects {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
                export type query = z.infer<typeof api_user_system_users_userId_projects_GET_query>;
              }
              export type response = { [K in keyof typeof api_user_system_users_userId_projects_GET_response]: z.infer<(typeof api_user_system_users_userId_projects_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-system/users/[userId]/projects";
                export type signature = "api_user_system_users_userId_projects_GET";
              }
            }
          }
          export namespace roles {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
              }
              export type response = { [K in keyof typeof api_user_system_users_userId_roles_GET_response]: z.infer<(typeof api_user_system_users_userId_roles_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-system/users/[userId]/roles";
                export type signature = "api_user_system_users_userId_roles_GET";
              }
            }
          }
          export namespace wallet {
            export namespace GET {
              export namespace request {
                export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
              }
              export type response = { [K in keyof typeof api_user_system_users_userId_wallet_GET_response]: z.infer<(typeof api_user_system_users_userId_wallet_GET_response)[K]> };
              export namespace metadata {
                export type method = "GET";
                export type path = "/api/user-system/users/[userId]/wallet";
                export type signature = "api_user_system_users_userId_wallet_GET";
              }
            }
            export namespace transactions {
              export namespace GET {
                export namespace request {
                  export type params = z.infer<z.ZodObject<{userId: z.ZodString}>>;
                  export type query = z.infer<typeof api_user_system_users_userId_wallet_transactions_GET_query>;
                }
                export type response = { [K in keyof typeof api_user_system_users_userId_wallet_transactions_GET_response]: z.infer<(typeof api_user_system_users_userId_wallet_transactions_GET_response)[K]> };
                export namespace metadata {
                  export type method = "GET";
                  export type path = "/api/user-system/users/[userId]/wallet/transactions";
                  export type signature = "api_user_system_users_userId_wallet_transactions_GET";
                }
              }
            }
          }
        }
      }
    }
  }
}

export const models = {
  ".vscode": {},
  "articleSystem": {
    "article.model": {
      "ArticleModels": model_articleSystem_article_model_ArticleModels
    },
    "article.model_model": model_articleSystem_article_model_ArticleModels,
    "comment.model": {
      "ArticleCommentModels": model_articleSystem_comment_model_ArticleCommentModels
    },
    "comment.model_model": model_articleSystem_comment_model_ArticleCommentModels,
    "index": {
      "ArticleSystemModels": model_articleSystem_index_ArticleSystemModels
    },
    "index_model": model_articleSystem_index_ArticleSystemModels
  },
  "economySystem": {
    "index": {
      "EconomySystemModels": model_economySystem_index_EconomySystemModels
    },
    "index_model": model_economySystem_index_EconomySystemModels,
    "transaction": {
      "TransactionModels": model_economySystem_transaction_TransactionModels
    },
    "transaction_model": model_economySystem_transaction_TransactionModels,
    "wallet": {
      "WalletModels": model_economySystem_wallet_WalletModels
    },
    "wallet_model": model_economySystem_wallet_WalletModels
  },
  "eventSystem": {
    "attendance.model": {
      "AttendanceModels": model_eventSystem_attendance_model_AttendanceModels
    },
    "attendance.model_model": model_eventSystem_attendance_model_AttendanceModels,
    "attendee.model": {
      "AttendeeModels": model_eventSystem_attendee_model_AttendeeModels
    },
    "attendee.model_model": model_eventSystem_attendee_model_AttendeeModels,
    "checkin.model": {
      "CheckinModels": model_eventSystem_checkin_model_CheckinModels
    },
    "checkin.model_model": model_eventSystem_checkin_model_CheckinModels,
    "event.model": {
      "EventModels": model_eventSystem_event_model_EventModels
    },
    "event.model_model": model_eventSystem_event_model_EventModels,
    "index": {
      "EventSystemModels": model_eventSystem_index_EventSystemModels
    },
    "index_model": model_eventSystem_index_EventSystemModels
  },
  "fileSystem": {
    "file": {
      "row": model_fileSystem_file_row,
      "insert": model_fileSystem_file_insert,
      "update": model_fileSystem_file_update
    },
    "file_model": model_fileSystem_file_update,
    "index": {}
  },
  "index": {
    "Models": model_index_Models
  },
  "index_model": model_index_Models,
  "learningResourceSystem": {
    "externalResource": {
      "row": model_learningResourceSystem_externalResource_row,
      "insert": model_learningResourceSystem_externalResource_insert,
      "update": model_learningResourceSystem_externalResource_update
    },
    "externalResource_model": model_learningResourceSystem_externalResource_update,
    "index": {},
    "learningResource": {
      "shape": model_learningResourceSystem_learningResource_shape
    },
    "learningResource_model": model_learningResourceSystem_learningResource_shape,
    "studyJam": {
      "row": model_learningResourceSystem_studyJam_row,
      "insert": model_learningResourceSystem_studyJam_insert,
      "update": model_learningResourceSystem_studyJam_update
    },
    "studyJam_model": model_learningResourceSystem_studyJam_update
  },
  "publicationSystem": {
    "article": {
      "row": model_publicationSystem_article_row,
      "insert": model_publicationSystem_article_insert,
      "update": model_publicationSystem_article_update
    },
    "article_model": model_publicationSystem_article_update,
    "event": {
      "row": model_publicationSystem_event_row,
      "insert": model_publicationSystem_event_insert,
      "update": model_publicationSystem_event_update
    },
    "event_model": model_publicationSystem_event_update,
    "highlight": {
      "row": model_publicationSystem_highlight_row,
      "insert": model_publicationSystem_highlight_insert,
      "update": model_publicationSystem_highlight_update
    },
    "highlight_model": model_publicationSystem_highlight_update,
    "index": {}
  },
  "rbacSystem": {
    "index": {},
    "permission": {
      "row": model_rbacSystem_permission_row,
      "insert": model_rbacSystem_permission_insert,
      "update": model_rbacSystem_permission_update
    },
    "permission_model": model_rbacSystem_permission_update,
    "roles": {
      "row": model_rbacSystem_roles_row,
      "insert": model_rbacSystem_roles_insert,
      "update": model_rbacSystem_roles_update
    },
    "roles_model": model_rbacSystem_roles_update
  },
  "resourceSystem": {
    "index": {},
    "resource": {
      "row": model_resourceSystem_resource_row,
      "insertDTO": model_resourceSystem_resource_insertDTO,
      "updateDTO": model_resourceSystem_resource_updateDTO
    },
    "resource_model": model_resourceSystem_resource_updateDTO
  },
  "roleSystem": {
    "index": {},
    "role": {
      "row": model_roleSystem_role_row,
      "insertDTO": model_roleSystem_role_insertDTO,
      "updateDTO": model_roleSystem_role_updateDTO
    },
    "role_model": model_roleSystem_role_updateDTO
  },
  "teamSystem": {
    "index": {},
    "member": {
      "row": model_teamSystem_member_row,
      "insert": model_teamSystem_member_insert
    },
    "member_model": model_teamSystem_member_insert,
    "team": {
      "team": model_teamSystem_team_team,
      "teamInsertDTO": model_teamSystem_team_teamInsertDTO,
      "teamUpdateDTO": model_teamSystem_team_teamUpdateDTO
    },
    "team_model": model_teamSystem_team_teamUpdateDTO
  },
  "userResourceSystem": {
    "index": {},
    "project": {
      "row": model_userResourceSystem_project_row,
      "insertDTO": model_userResourceSystem_project_insertDTO,
      "updateDTO": model_userResourceSystem_project_updateDTO
    },
    "project_model": model_userResourceSystem_project_updateDTO
  },
  "userSystem": {
    "index": {},
    "profile": {
      "row": model_userSystem_profile_row,
      "insertDTO": model_userSystem_profile_insertDTO,
      "updateDTO": model_userSystem_profile_updateDTO
    },
    "profile_model": model_userSystem_profile_updateDTO,
    "user": {
      "row": model_userSystem_user_row,
      "insertDTO": model_userSystem_user_insertDTO,
      "updateDTO": model_userSystem_user_updateDTO
    },
    "user_model": model_userSystem_user_updateDTO
  }
}

export namespace models {
  export namespace _vscode {

  }
  export namespace articleSystem {
    export namespace article_model {
      export type ArticleModels = z.infer<typeof model_articleSystem_article_model_ArticleModels>;
    }
    export namespace comment_model {
      export type ArticleCommentModels = z.infer<typeof model_articleSystem_comment_model_ArticleCommentModels>;
    }
    export namespace index {
      export type ArticleSystemModels = z.infer<typeof model_articleSystem_index_ArticleSystemModels>;
    }
  }
  export namespace economySystem {
    export namespace index {
      export type EconomySystemModels = z.infer<typeof model_economySystem_index_EconomySystemModels>;
    }
    export namespace transaction {
      export type TransactionModels = z.infer<typeof model_economySystem_transaction_TransactionModels>;
    }
    export namespace wallet {
      export type WalletModels = z.infer<typeof model_economySystem_wallet_WalletModels>;
    }
  }
  export namespace eventSystem {
    export namespace attendance_model {
      export type AttendanceModels = z.infer<typeof model_eventSystem_attendance_model_AttendanceModels>;
    }
    export namespace attendee_model {
      export type AttendeeModels = z.infer<typeof model_eventSystem_attendee_model_AttendeeModels>;
    }
    export namespace checkin_model {
      export type CheckinModels = z.infer<typeof model_eventSystem_checkin_model_CheckinModels>;
    }
    export namespace event_model {
      export type EventModels = z.infer<typeof model_eventSystem_event_model_EventModels>;
    }
    export namespace index {
      export type EventSystemModels = z.infer<typeof model_eventSystem_index_EventSystemModels>;
    }
  }
  export namespace fileSystem {
    export namespace file {
      export type row = z.infer<typeof model_fileSystem_file_row>;
      export type insert = z.infer<typeof model_fileSystem_file_insert>;
      export type update = z.infer<typeof model_fileSystem_file_update>;
    }
    export namespace index {

    }
  }
  export namespace index {
    export type Models = z.infer<typeof model_index_Models>;
  }
  export namespace learningResourceSystem {
    export namespace externalResource {
      export type row = z.infer<typeof model_learningResourceSystem_externalResource_row>;
      export type insert = z.infer<typeof model_learningResourceSystem_externalResource_insert>;
      export type update = z.infer<typeof model_learningResourceSystem_externalResource_update>;
    }
    export namespace index {

    }
    export namespace learningResource {
      export type shape = z.infer<typeof model_learningResourceSystem_learningResource_shape>;
    }
    export namespace studyJam {
      export type row = z.infer<typeof model_learningResourceSystem_studyJam_row>;
      export type insert = z.infer<typeof model_learningResourceSystem_studyJam_insert>;
      export type update = z.infer<typeof model_learningResourceSystem_studyJam_update>;
    }
  }
  export namespace publicationSystem {
    export namespace article {
      export type row = z.infer<typeof model_publicationSystem_article_row>;
      export type insert = z.infer<typeof model_publicationSystem_article_insert>;
      export type update = z.infer<typeof model_publicationSystem_article_update>;
    }
    export namespace event {
      export type row = z.infer<typeof model_publicationSystem_event_row>;
      export type insert = z.infer<typeof model_publicationSystem_event_insert>;
      export type update = z.infer<typeof model_publicationSystem_event_update>;
    }
    export namespace highlight {
      export type row = z.infer<typeof model_publicationSystem_highlight_row>;
      export type insert = z.infer<typeof model_publicationSystem_highlight_insert>;
      export type update = z.infer<typeof model_publicationSystem_highlight_update>;
    }
    export namespace index {

    }
  }
  export namespace rbacSystem {
    export namespace index {

    }
    export namespace permission {
      export type row = z.infer<typeof model_rbacSystem_permission_row>;
      export type insert = z.infer<typeof model_rbacSystem_permission_insert>;
      export type update = z.infer<typeof model_rbacSystem_permission_update>;
    }
    export namespace roles {
      export type row = z.infer<typeof model_rbacSystem_roles_row>;
      export type insert = z.infer<typeof model_rbacSystem_roles_insert>;
      export type update = z.infer<typeof model_rbacSystem_roles_update>;
    }
  }
  export namespace resourceSystem {
    export namespace index {

    }
    export namespace resource {
      export type row = z.infer<typeof model_resourceSystem_resource_row>;
      export type insertDTO = z.infer<typeof model_resourceSystem_resource_insertDTO>;
      export type updateDTO = z.infer<typeof model_resourceSystem_resource_updateDTO>;
    }
  }
  export namespace roleSystem {
    export namespace index {

    }
    export namespace role {
      export type row = z.infer<typeof model_roleSystem_role_row>;
      export type insertDTO = z.infer<typeof model_roleSystem_role_insertDTO>;
      export type updateDTO = z.infer<typeof model_roleSystem_role_updateDTO>;
    }
  }
  export namespace teamSystem {
    export namespace index {

    }
    export namespace member {
      export type row = z.infer<typeof model_teamSystem_member_row>;
      export type insert = z.infer<typeof model_teamSystem_member_insert>;
    }
    export namespace team {
      export type team = z.infer<typeof model_teamSystem_team_team>;
      export type teamInsertDTO = z.infer<typeof model_teamSystem_team_teamInsertDTO>;
      export type teamUpdateDTO = z.infer<typeof model_teamSystem_team_teamUpdateDTO>;
    }
  }
  export namespace userResourceSystem {
    export namespace index {

    }
    export namespace project {
      export type row = z.infer<typeof model_userResourceSystem_project_row>;
      export type insertDTO = z.infer<typeof model_userResourceSystem_project_insertDTO>;
      export type updateDTO = z.infer<typeof model_userResourceSystem_project_updateDTO>;
    }
  }
  export namespace userSystem {
    export namespace index {

    }
    export namespace profile {
      export type row = z.infer<typeof model_userSystem_profile_row>;
      export type insertDTO = z.infer<typeof model_userSystem_profile_insertDTO>;
      export type updateDTO = z.infer<typeof model_userSystem_profile_updateDTO>;
    }
    export namespace user {
      export type row = z.infer<typeof model_userSystem_user_row>;
      export type insertDTO = z.infer<typeof model_userSystem_user_insertDTO>;
      export type updateDTO = z.infer<typeof model_userSystem_user_updateDTO>;
    }
  }
}

