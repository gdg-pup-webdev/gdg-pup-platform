
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT. 
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {z} from "zod";

import { query as api_economy_system_transactions_GET_query } from "./routes/api/economy-system/transactions/GET";
import { response as api_economy_system_transactions_GET_response } from "./routes/api/economy-system/transactions/GET";
import { query as api_economy_system_wallets_GET_query } from "./routes/api/economy-system/wallets/GET";
import { response as api_economy_system_wallets_GET_response } from "./routes/api/economy-system/wallets/GET";
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
import { query as api_learning_resource_system_external_resources_GET_query } from "./routes/api/learning-resource-system/external-resources/GET";
import { response as api_learning_resource_system_external_resources_GET_response } from "./routes/api/learning-resource-system/external-resources/GET";
import { body as api_learning_resource_system_external_resources_POST_body } from "./routes/api/learning-resource-system/external-resources/POST";
import { response as api_learning_resource_system_external_resources_POST_response } from "./routes/api/learning-resource-system/external-resources/POST";
import { response as api_learning_resource_system_external_resources_externalResourceId_DELETE_response } from "./routes/api/learning-resource-system/external-resources/[externalResourceId]/DELETE";
import { response as api_learning_resource_system_external_resources_externalResourceId_GET_response } from "./routes/api/learning-resource-system/external-resources/[externalResourceId]/GET";
import { body as api_learning_resource_system_external_resources_externalResourceId_PATCH_body } from "./routes/api/learning-resource-system/external-resources/[externalResourceId]/PATCH";
import { response as api_learning_resource_system_external_resources_externalResourceId_PATCH_response } from "./routes/api/learning-resource-system/external-resources/[externalResourceId]/PATCH";
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
import { query as api_publication_system_articles_articleId_comments_GET_query } from "./routes/api/publication-system/articles/[articleId]/comments/GET";
import { response as api_publication_system_articles_articleId_comments_GET_response } from "./routes/api/publication-system/articles/[articleId]/comments/GET";
import { body as api_publication_system_articles_articleId_comments_POST_body } from "./routes/api/publication-system/articles/[articleId]/comments/POST";
import { response as api_publication_system_articles_articleId_comments_POST_response } from "./routes/api/publication-system/articles/[articleId]/comments/POST";
import { response as api_publication_system_articles_articleId_comments_commentId_DELETE_response } from "./routes/api/publication-system/articles/[articleId]/comments/[commentId]/DELETE";
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
import { response as api_publication_system_highlights_highlightId_DELETE_response } from "./routes/api/publication-system/highlights/[highlightId]/DELETE";
import { response as api_publication_system_highlights_highlightId_GET_response } from "./routes/api/publication-system/highlights/[highlightId]/GET";
import { body as api_publication_system_highlights_highlightId_PATCH_body } from "./routes/api/publication-system/highlights/[highlightId]/PATCH";
import { response as api_publication_system_highlights_highlightId_PATCH_response } from "./routes/api/publication-system/highlights/[highlightId]/PATCH";
import { query as api_rbac_system_roles_GET_query } from "./routes/api/rbac-system/roles/GET";
import { response as api_rbac_system_roles_GET_response } from "./routes/api/rbac-system/roles/GET";
import { body as api_rbac_system_roles_POST_body } from "./routes/api/rbac-system/roles/POST";
import { response as api_rbac_system_roles_POST_response } from "./routes/api/rbac-system/roles/POST";
import { response as api_rbac_system_roles_roleId_DELETE_response } from "./routes/api/rbac-system/roles/[roleId]/DELETE";
import { response as api_rbac_system_roles_roleId_GET_response } from "./routes/api/rbac-system/roles/[roleId]/GET";
import { response as api_rbac_system_roles_roleId_PATCH_response } from "./routes/api/rbac-system/roles/[roleId]/PATCH";
import { description as api_rbac_system_roles_roleId_permissions_GET_description } from "./routes/api/rbac-system/roles/[roleId]/permissions/GET";
import { query as api_rbac_system_roles_roleId_permissions_GET_query } from "./routes/api/rbac-system/roles/[roleId]/permissions/GET";
import { response as api_rbac_system_roles_roleId_permissions_GET_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/GET";
import { body as api_rbac_system_roles_roleId_permissions_POST_body } from "./routes/api/rbac-system/roles/[roleId]/permissions/POST";
import { response as api_rbac_system_roles_roleId_permissions_POST_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/POST";
import { response as api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/[permissionId]/DELETE";
import { response as api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response } from "./routes/api/rbac-system/roles/[roleId]/permissions/[permissionId]/PATCH";
import { query as api_reward_system_rewards_GET_query } from "./routes/api/reward-system/rewards/GET";
import { response as api_reward_system_rewards_GET_response } from "./routes/api/reward-system/rewards/GET";
import { body as api_reward_system_rewards_POST_body } from "./routes/api/reward-system/rewards/POST";
import { response as api_reward_system_rewards_POST_response } from "./routes/api/reward-system/rewards/POST";
import { response as api_reward_system_rewards_rewardId_claim_POST_response } from "./routes/api/reward-system/rewards/[rewardId]/claim/POST";
import { response as api_reward_system_rewards_rewardId_DELETE_response } from "./routes/api/reward-system/rewards/[rewardId]/DELETE";
import { response as api_reward_system_rewards_rewardId_GET_response } from "./routes/api/reward-system/rewards/[rewardId]/GET";
import { description as api_team_system_members_GET_description } from "./routes/api/team-system/members/GET";
import { query as api_team_system_members_GET_query } from "./routes/api/team-system/members/GET";
import { response as api_team_system_members_GET_response } from "./routes/api/team-system/members/GET";
import { description as api_team_system_members_POST_description } from "./routes/api/team-system/members/POST";
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
import { response as api_user_system_users_userId_aggregate_GET_response } from "./routes/api/user-system/users/[userId]/aggregate/GET";
import { response as api_user_system_users_userId_GET_response } from "./routes/api/user-system/users/[userId]/GET";
import { row as model_economySystem_transaction_row } from "./models/economySystem/transaction";
import { insertDTO as model_economySystem_transaction_insertDTO } from "./models/economySystem/transaction";
import { updateDTO as model_economySystem_transaction_updateDTO } from "./models/economySystem/transaction";
import { row as model_economySystem_wallet_row } from "./models/economySystem/wallet";
import { insertDTO as model_economySystem_wallet_insertDTO } from "./models/economySystem/wallet";
import { updateDTO as model_economySystem_wallet_updateDTO } from "./models/economySystem/wallet";
import { row as model_eventSystem_attendance_row } from "./models/eventSystem/attendance";
import { insertDTO as model_eventSystem_attendance_insertDTO } from "./models/eventSystem/attendance";
import { updateDTO as model_eventSystem_attendance_updateDTO } from "./models/eventSystem/attendance";
import { row as model_eventSystem_attendee_row } from "./models/eventSystem/attendee";
import { insertDTO as model_eventSystem_checkin_insertDTO } from "./models/eventSystem/checkin";
import { row as model_eventSystem_event_row } from "./models/eventSystem/event";
import { insertDTO as model_eventSystem_event_insertDTO } from "./models/eventSystem/event";
import { updateDTO as model_eventSystem_event_updateDTO } from "./models/eventSystem/event";
import { row as model_fileSystem_file_row } from "./models/fileSystem/file";
import { insert as model_fileSystem_file_insert } from "./models/fileSystem/file";
import { update as model_fileSystem_file_update } from "./models/fileSystem/file";
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
import { row as model_publicationSystem_articleComment_row } from "./models/publicationSystem/articleComment";
import { insertDTO as model_publicationSystem_articleComment_insertDTO } from "./models/publicationSystem/articleComment";
import { updateDTO as model_publicationSystem_articleComment_updateDTO } from "./models/publicationSystem/articleComment";
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
import { row as model_rewardSystem_reward_row } from "./models/rewardSystem/reward";
import { insert as model_rewardSystem_reward_insert } from "./models/rewardSystem/reward";
import { update as model_rewardSystem_reward_update } from "./models/rewardSystem/reward";
import { claimResponse as model_rewardSystem_reward_claimResponse } from "./models/rewardSystem/reward";
import { row as model_roleSystem_role_row } from "./models/roleSystem/role";
import { insertDTO as model_roleSystem_role_insertDTO } from "./models/roleSystem/role";
import { updateDTO as model_roleSystem_role_updateDTO } from "./models/roleSystem/role";
import { row as model_teamSystem_member_row } from "./models/teamSystem/member";
import { insert as model_teamSystem_member_insert } from "./models/teamSystem/member";
import { update as model_teamSystem_member_update } from "./models/teamSystem/member";
import { row as model_teamSystem_team_row } from "./models/teamSystem/team";
import { insert as model_teamSystem_team_insert } from "./models/teamSystem/team";
import { update as model_teamSystem_team_update } from "./models/teamSystem/team";
import { row as model_userResourceSystem_project_row } from "./models/userResourceSystem/project";
import { insertDTO as model_userResourceSystem_project_insertDTO } from "./models/userResourceSystem/project";
import { updateDTO as model_userResourceSystem_project_updateDTO } from "./models/userResourceSystem/project";
import { row as model_userSystem_profile_row } from "./models/userSystem/profile";
import { insertDTO as model_userSystem_profile_insertDTO } from "./models/userSystem/profile";
import { updateDTO as model_userSystem_profile_updateDTO } from "./models/userSystem/profile";
import { row as model_userSystem_user_row } from "./models/userSystem/user";
import { insertDTO as model_userSystem_user_insertDTO } from "./models/userSystem/user";
import { updateDTO as model_userSystem_user_updateDTO } from "./models/userSystem/user";
import { aggregate as model_userSystem_user_aggregate } from "./models/userSystem/user";

export const EndpointSchemas = {
  "api_economy_system_transactions_GET": {
    "request": {
      "query": api_economy_system_transactions_GET_query
    },
    "response": api_economy_system_transactions_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/economy-system/transactions",
      "signature": "api_economy_system_transactions_GET"
    }
  },
  "api_economy_system_wallets_GET": {
    "request": {
      "query": api_economy_system_wallets_GET_query
    },
    "response": api_economy_system_wallets_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/economy-system/wallets",
      "signature": "api_economy_system_wallets_GET"
    }
  },
  "api_event_system_checkin_POST": {
    "request": {
      "body": api_event_system_checkin_POST_body
    },
    "response": api_event_system_checkin_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/event-system/checkin",
      "signature": "api_event_system_checkin_POST"
    }
  },
  "api_event_system_events_GET": {
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
  "api_event_system_events_POST": {
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
  "api_event_system_events_eventId_attendees_GET": {
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
  },
  "api_event_system_events_eventId_DELETE": {
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
  "api_event_system_events_eventId_GET": {
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
  "api_event_system_events_eventId_PATCH": {
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
  },
  "api_file_system_files_GET": {
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
  "api_file_system_files_POST": {
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
  "api_file_system_files_fileId_DELETE": {
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
  "api_file_system_files_fileId_GET": {
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
  "api_file_system_files_fileId_PATCH": {
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
  },
  "api_health_GET": {
    "request": {},
    "response": api_health_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/health",
      "signature": "api_health_GET"
    }
  },
  "api_leaderboard_system_GET": {
    "request": {},
    "response": api_leaderboard_system_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/leaderboard-system",
      "signature": "api_leaderboard_system_GET"
    }
  },
  "api_learning_resource_system_external_resources_GET": {
    "request": {
      "query": api_learning_resource_system_external_resources_GET_query
    },
    "response": api_learning_resource_system_external_resources_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/learning-resource-system/external-resources",
      "signature": "api_learning_resource_system_external_resources_GET"
    }
  },
  "api_learning_resource_system_external_resources_POST": {
    "request": {
      "body": api_learning_resource_system_external_resources_POST_body
    },
    "response": api_learning_resource_system_external_resources_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/learning-resource-system/external-resources",
      "signature": "api_learning_resource_system_external_resources_POST"
    }
  },
  "api_learning_resource_system_external_resources_externalResourceId_DELETE": {
    "request": {
      "params": z.object({externalResourceId: z.string()})
    },
    "response": api_learning_resource_system_external_resources_externalResourceId_DELETE_response,
    "metadata": {
      "method": "DELETE",
      "path": "/api/learning-resource-system/external-resources/[externalResourceId]",
      "signature": "api_learning_resource_system_external_resources_externalResourceId_DELETE"
    }
  },
  "api_learning_resource_system_external_resources_externalResourceId_GET": {
    "request": {
      "params": z.object({externalResourceId: z.string()})
    },
    "response": api_learning_resource_system_external_resources_externalResourceId_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/learning-resource-system/external-resources/[externalResourceId]",
      "signature": "api_learning_resource_system_external_resources_externalResourceId_GET"
    }
  },
  "api_learning_resource_system_external_resources_externalResourceId_PATCH": {
    "request": {
      "params": z.object({externalResourceId: z.string()}),
      "body": api_learning_resource_system_external_resources_externalResourceId_PATCH_body
    },
    "response": api_learning_resource_system_external_resources_externalResourceId_PATCH_response,
    "metadata": {
      "method": "PATCH",
      "path": "/api/learning-resource-system/external-resources/[externalResourceId]",
      "signature": "api_learning_resource_system_external_resources_externalResourceId_PATCH"
    }
  },
  "api_learning_resource_system_GET": {
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
  "api_learning_resource_system_study_jams_GET": {
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
  "api_learning_resource_system_study_jams_POST": {
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
  "api_learning_resource_system_study_jams_studyJamId_DELETE": {
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
  "api_learning_resource_system_study_jams_studyJamId_GET": {
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
  "api_learning_resource_system_study_jams_studyJamId_PATCH": {
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
  },
  "api_publication_system_articles_GET": {
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
  "api_publication_system_articles_POST": {
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
  "api_publication_system_articles_articleId_comments_GET": {
    "request": {
      "params": z.object({articleId: z.string()}),
      "query": api_publication_system_articles_articleId_comments_GET_query
    },
    "response": api_publication_system_articles_articleId_comments_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/publication-system/articles/[articleId]/comments",
      "signature": "api_publication_system_articles_articleId_comments_GET"
    }
  },
  "api_publication_system_articles_articleId_comments_POST": {
    "request": {
      "params": z.object({articleId: z.string()}),
      "body": api_publication_system_articles_articleId_comments_POST_body
    },
    "response": api_publication_system_articles_articleId_comments_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/publication-system/articles/[articleId]/comments",
      "signature": "api_publication_system_articles_articleId_comments_POST"
    }
  },
  "api_publication_system_articles_articleId_comments_commentId_DELETE": {
    "request": {
      "params": z.object({articleId: z.string(),commentId: z.string()})
    },
    "response": api_publication_system_articles_articleId_comments_commentId_DELETE_response,
    "metadata": {
      "method": "DELETE",
      "path": "/api/publication-system/articles/[articleId]/comments/[commentId]",
      "signature": "api_publication_system_articles_articleId_comments_commentId_DELETE"
    }
  },
  "api_publication_system_articles_articleId_DELETE": {
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
  "api_publication_system_articles_articleId_GET": {
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
  "api_publication_system_articles_articleId_PATCH": {
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
  },
  "api_publication_system_events_GET": {
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
  "api_publication_system_events_POST": {
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
  "api_publication_system_events_articleId_DELETE": {
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
  "api_publication_system_events_articleId_GET": {
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
  "api_publication_system_events_articleId_PATCH": {
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
  },
  "api_publication_system_highlights_GET": {
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
  "api_publication_system_highlights_POST": {
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
  "api_publication_system_highlights_highlightId_DELETE": {
    "request": {
      "params": z.object({highlightId: z.string()})
    },
    "response": api_publication_system_highlights_highlightId_DELETE_response,
    "metadata": {
      "method": "DELETE",
      "path": "/api/publication-system/highlights/[highlightId]",
      "signature": "api_publication_system_highlights_highlightId_DELETE"
    }
  },
  "api_publication_system_highlights_highlightId_GET": {
    "request": {
      "params": z.object({highlightId: z.string()})
    },
    "response": api_publication_system_highlights_highlightId_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/publication-system/highlights/[highlightId]",
      "signature": "api_publication_system_highlights_highlightId_GET"
    }
  },
  "api_publication_system_highlights_highlightId_PATCH": {
    "request": {
      "params": z.object({highlightId: z.string()}),
      "body": api_publication_system_highlights_highlightId_PATCH_body
    },
    "response": api_publication_system_highlights_highlightId_PATCH_response,
    "metadata": {
      "method": "PATCH",
      "path": "/api/publication-system/highlights/[highlightId]",
      "signature": "api_publication_system_highlights_highlightId_PATCH"
    }
  },
  "api_rbac_system_roles_GET": {
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
  "api_rbac_system_roles_POST": {
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
  "api_rbac_system_roles_roleId_DELETE": {
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
  "api_rbac_system_roles_roleId_GET": {
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
  "api_rbac_system_roles_roleId_PATCH": {
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
  "api_rbac_system_roles_roleId_permissions_GET": {
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
  "api_rbac_system_roles_roleId_permissions_POST": {
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
  "api_rbac_system_roles_roleId_permissions_permissionId_DELETE": {
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
  "api_rbac_system_roles_roleId_permissions_permissionId_PATCH": {
    "request": {
      "params": z.object({roleId: z.string(),permissionId: z.string()})
    },
    "response": api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response,
    "metadata": {
      "method": "PATCH",
      "path": "/api/rbac-system/roles/[roleId]/permissions/[permissionId]",
      "signature": "api_rbac_system_roles_roleId_permissions_permissionId_PATCH"
    }
  },
  "api_reward_system_rewards_GET": {
    "request": {
      "query": api_reward_system_rewards_GET_query
    },
    "response": api_reward_system_rewards_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/reward-system/rewards",
      "signature": "api_reward_system_rewards_GET"
    }
  },
  "api_reward_system_rewards_POST": {
    "request": {
      "body": api_reward_system_rewards_POST_body
    },
    "response": api_reward_system_rewards_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/reward-system/rewards",
      "signature": "api_reward_system_rewards_POST"
    }
  },
  "api_reward_system_rewards_rewardId_claim_POST": {
    "request": {
      "params": z.object({rewardId: z.string()})
    },
    "response": api_reward_system_rewards_rewardId_claim_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/reward-system/rewards/[rewardId]/claim",
      "signature": "api_reward_system_rewards_rewardId_claim_POST"
    }
  },
  "api_reward_system_rewards_rewardId_DELETE": {
    "request": {
      "params": z.object({rewardId: z.string()})
    },
    "response": api_reward_system_rewards_rewardId_DELETE_response,
    "metadata": {
      "method": "DELETE",
      "path": "/api/reward-system/rewards/[rewardId]",
      "signature": "api_reward_system_rewards_rewardId_DELETE"
    }
  },
  "api_reward_system_rewards_rewardId_GET": {
    "request": {
      "params": z.object({rewardId: z.string()})
    },
    "response": api_reward_system_rewards_rewardId_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/reward-system/rewards/[rewardId]",
      "signature": "api_reward_system_rewards_rewardId_GET"
    }
  },
  "api_team_system_members_GET": {
    "request": {
      "description": api_team_system_members_GET_description,
      "query": api_team_system_members_GET_query
    },
    "response": api_team_system_members_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/team-system/members",
      "signature": "api_team_system_members_GET"
    }
  },
  "api_team_system_members_POST": {
    "request": {
      "description": api_team_system_members_POST_description,
      "body": api_team_system_members_POST_body
    },
    "response": api_team_system_members_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/team-system/members",
      "signature": "api_team_system_members_POST"
    }
  },
  "api_team_system_members_memberId_DELETE": {
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
  "api_team_system_members_memberId_GET": {
    "request": {
      "params": z.object({memberId: z.string()})
    },
    "response": api_team_system_members_memberId_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/team-system/members/[memberId]",
      "signature": "api_team_system_members_memberId_GET"
    }
  },
  "api_team_system_teams_GET": {
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
  "api_team_system_teams_POST": {
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
  "api_team_system_teams_teamId_DELETE": {
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
  "api_team_system_teams_teamId_GET": {
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
  "api_team_system_teams_teamId_PATCH": {
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
  },
  "api_user_resource_system_achivements_GET": {
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
  "api_user_resource_system_achivements_POST": {
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
  "api_user_resource_system_achivements_projectId_DELETE": {
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
  "api_user_resource_system_achivements_projectId_GET": {
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
  "api_user_resource_system_achivements_projectId_PATCH": {
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
  },
  "api_user_resource_system_certificates_GET": {
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
  "api_user_resource_system_certificates_POST": {
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
  "api_user_resource_system_certificates_projectId_DELETE": {
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
  "api_user_resource_system_certificates_projectId_GET": {
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
  "api_user_resource_system_certificates_projectId_PATCH": {
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
  },
  "api_user_resource_system_profiles_GET": {
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
  "api_user_resource_system_profiles_POST": {
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
  "api_user_resource_system_profiles_projectId_DELETE": {
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
  "api_user_resource_system_profiles_projectId_GET": {
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
  "api_user_resource_system_profiles_projectId_PATCH": {
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
  },
  "api_user_resource_system_projects_GET": {
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
  "api_user_resource_system_projects_POST": {
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
  "api_user_resource_system_projects_projectId_DELETE": {
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
  "api_user_resource_system_projects_projectId_GET": {
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
  "api_user_resource_system_projects_projectId_PATCH": {
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
  },
  "api_user_resource_system_settings_GET": {
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
  "api_user_resource_system_settings_POST": {
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
  "api_user_resource_system_settings_projectId_DELETE": {
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
  "api_user_resource_system_settings_projectId_GET": {
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
  "api_user_resource_system_settings_projectId_PATCH": {
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
  },
  "api_user_system_users_userId_aggregate_GET": {
    "request": {
      "params": z.object({userId: z.string()})
    },
    "response": api_user_system_users_userId_aggregate_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/user-system/users/[userId]/aggregate",
      "signature": "api_user_system_users_userId_aggregate_GET"
    }
  },
  "api_user_system_users_userId_GET": {
    "request": {
      "params": z.object({userId: z.string()})
    },
    "response": api_user_system_users_userId_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/user-system/users/[userId]",
      "signature": "api_user_system_users_userId_GET"
    }
  }
}

export const contract = {
  "api": {
    "economy_system": {
      "transactions": {
        "GET": {
          "request": {
            "query": api_economy_system_transactions_GET_query
          },
          "response": api_economy_system_transactions_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/economy-system/transactions",
            "signature": "api_economy_system_transactions_GET"
          }
        }
      },
      "wallets": {
        "GET": {
          "request": {
            "query": api_economy_system_wallets_GET_query
          },
          "response": api_economy_system_wallets_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/economy-system/wallets",
            "signature": "api_economy_system_wallets_GET"
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
      "external_resources": {
        "GET": {
          "request": {
            "query": api_learning_resource_system_external_resources_GET_query
          },
          "response": api_learning_resource_system_external_resources_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/learning-resource-system/external-resources",
            "signature": "api_learning_resource_system_external_resources_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_learning_resource_system_external_resources_POST_body
          },
          "response": api_learning_resource_system_external_resources_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/learning-resource-system/external-resources",
            "signature": "api_learning_resource_system_external_resources_POST"
          }
        },
        "externalResourceId": {
          "DELETE": {
            "request": {
              "params": z.object({externalResourceId: z.string()})
            },
            "response": api_learning_resource_system_external_resources_externalResourceId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/learning-resource-system/external-resources/[externalResourceId]",
              "signature": "api_learning_resource_system_external_resources_externalResourceId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({externalResourceId: z.string()})
            },
            "response": api_learning_resource_system_external_resources_externalResourceId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/learning-resource-system/external-resources/[externalResourceId]",
              "signature": "api_learning_resource_system_external_resources_externalResourceId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({externalResourceId: z.string()}),
              "body": api_learning_resource_system_external_resources_externalResourceId_PATCH_body
            },
            "response": api_learning_resource_system_external_resources_externalResourceId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/learning-resource-system/external-resources/[externalResourceId]",
              "signature": "api_learning_resource_system_external_resources_externalResourceId_PATCH"
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
          "comments": {
            "GET": {
              "request": {
                "params": z.object({articleId: z.string()}),
                "query": api_publication_system_articles_articleId_comments_GET_query
              },
              "response": api_publication_system_articles_articleId_comments_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/publication-system/articles/[articleId]/comments",
                "signature": "api_publication_system_articles_articleId_comments_GET"
              }
            },
            "POST": {
              "request": {
                "params": z.object({articleId: z.string()}),
                "body": api_publication_system_articles_articleId_comments_POST_body
              },
              "response": api_publication_system_articles_articleId_comments_POST_response,
              "metadata": {
                "method": "POST",
                "path": "/api/publication-system/articles/[articleId]/comments",
                "signature": "api_publication_system_articles_articleId_comments_POST"
              }
            },
            "commentId": {
              "DELETE": {
                "request": {
                  "params": z.object({articleId: z.string(),commentId: z.string()})
                },
                "response": api_publication_system_articles_articleId_comments_commentId_DELETE_response,
                "metadata": {
                  "method": "DELETE",
                  "path": "/api/publication-system/articles/[articleId]/comments/[commentId]",
                  "signature": "api_publication_system_articles_articleId_comments_commentId_DELETE"
                }
              }
            }
          },
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
        "highlightId": {
          "DELETE": {
            "request": {
              "params": z.object({highlightId: z.string()})
            },
            "response": api_publication_system_highlights_highlightId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/publication-system/highlights/[highlightId]",
              "signature": "api_publication_system_highlights_highlightId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({highlightId: z.string()})
            },
            "response": api_publication_system_highlights_highlightId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/publication-system/highlights/[highlightId]",
              "signature": "api_publication_system_highlights_highlightId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({highlightId: z.string()}),
              "body": api_publication_system_highlights_highlightId_PATCH_body
            },
            "response": api_publication_system_highlights_highlightId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/publication-system/highlights/[highlightId]",
              "signature": "api_publication_system_highlights_highlightId_PATCH"
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
    "reward_system": {
      "rewards": {
        "GET": {
          "request": {
            "query": api_reward_system_rewards_GET_query
          },
          "response": api_reward_system_rewards_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/reward-system/rewards",
            "signature": "api_reward_system_rewards_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_reward_system_rewards_POST_body
          },
          "response": api_reward_system_rewards_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/reward-system/rewards",
            "signature": "api_reward_system_rewards_POST"
          }
        },
        "rewardId": {
          "claim": {
            "POST": {
              "request": {
                "params": z.object({rewardId: z.string()})
              },
              "response": api_reward_system_rewards_rewardId_claim_POST_response,
              "metadata": {
                "method": "POST",
                "path": "/api/reward-system/rewards/[rewardId]/claim",
                "signature": "api_reward_system_rewards_rewardId_claim_POST"
              }
            }
          },
          "DELETE": {
            "request": {
              "params": z.object({rewardId: z.string()})
            },
            "response": api_reward_system_rewards_rewardId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/reward-system/rewards/[rewardId]",
              "signature": "api_reward_system_rewards_rewardId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({rewardId: z.string()})
            },
            "response": api_reward_system_rewards_rewardId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/reward-system/rewards/[rewardId]",
              "signature": "api_reward_system_rewards_rewardId_GET"
            }
          }
        }
      }
    },
    "team_system": {
      "members": {
        "GET": {
          "request": {
            "description": api_team_system_members_GET_description,
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
            "description": api_team_system_members_POST_description,
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
      }
    },
    "user_system": {
      "users": {
        "userId": {
          "aggregate": {
            "GET": {
              "request": {
                "params": z.object({userId: z.string()})
              },
              "response": api_user_system_users_userId_aggregate_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/user-system/users/[userId]/aggregate",
                "signature": "api_user_system_users_userId_aggregate_GET"
              }
            }
          },
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
          }
        }
      }
    }
  }
}

export const models = {
  "economySystem": {
    "transaction_model": model_economySystem_transaction_updateDTO,
    "wallet_model": model_economySystem_wallet_updateDTO
  },
  "eventSystem": {
    "attendance_model": model_eventSystem_attendance_updateDTO,
    "attendee_model": model_eventSystem_attendee_row,
    "checkin_model": model_eventSystem_checkin_insertDTO,
    "event_model": model_eventSystem_event_updateDTO
  },
  "fileSystem": {
    "file_model": model_fileSystem_file_update
  },
  "learningResourceSystem": {
    "externalResource_model": model_learningResourceSystem_externalResource_update,
    "learningResource_model": model_learningResourceSystem_learningResource_shape,
    "studyJam_model": model_learningResourceSystem_studyJam_update
  },
  "publicationSystem": {
    "article_model": model_publicationSystem_article_update,
    "articleComment_model": model_publicationSystem_articleComment_updateDTO,
    "event_model": model_publicationSystem_event_update,
    "highlight_model": model_publicationSystem_highlight_update
  },
  "rbacSystem": {
    "permission_model": model_rbacSystem_permission_update,
    "roles_model": model_rbacSystem_roles_update
  },
  "resourceSystem": {
    "resource_model": model_resourceSystem_resource_updateDTO
  },
  "rewardSystem": {
    "reward_model": model_rewardSystem_reward_claimResponse
  },
  "roleSystem": {
    "role_model": model_roleSystem_role_updateDTO
  },
  "teamSystem": {
    "member_model": model_teamSystem_member_update,
    "team_model": model_teamSystem_team_update
  },
  "userResourceSystem": {
    "project_model": model_userResourceSystem_project_updateDTO
  },
  "userSystem": {
    "profile_model": model_userSystem_profile_updateDTO,
    "user_model": model_userSystem_user_aggregate
  }
}

export type ResponseTypes = {
  api_economy_system_transactions_GET : { [K in keyof typeof api_economy_system_transactions_GET_response]: z.infer<typeof api_economy_system_transactions_GET_response[K]> },
  api_economy_system_wallets_GET : { [K in keyof typeof api_economy_system_wallets_GET_response]: z.infer<typeof api_economy_system_wallets_GET_response[K]> },
  api_event_system_checkin_POST : { [K in keyof typeof api_event_system_checkin_POST_response]: z.infer<typeof api_event_system_checkin_POST_response[K]> },
  api_event_system_events_GET : { [K in keyof typeof api_event_system_events_GET_response]: z.infer<typeof api_event_system_events_GET_response[K]> },
  api_event_system_events_POST : { [K in keyof typeof api_event_system_events_POST_response]: z.infer<typeof api_event_system_events_POST_response[K]> },
  api_event_system_events_eventId_attendees_GET : { [K in keyof typeof api_event_system_events_eventId_attendees_GET_response]: z.infer<typeof api_event_system_events_eventId_attendees_GET_response[K]> },
  api_event_system_events_eventId_DELETE : { [K in keyof typeof api_event_system_events_eventId_DELETE_response]: z.infer<typeof api_event_system_events_eventId_DELETE_response[K]> },
  api_event_system_events_eventId_GET : { [K in keyof typeof api_event_system_events_eventId_GET_response]: z.infer<typeof api_event_system_events_eventId_GET_response[K]> },
  api_event_system_events_eventId_PATCH : { [K in keyof typeof api_event_system_events_eventId_PATCH_response]: z.infer<typeof api_event_system_events_eventId_PATCH_response[K]> },
  api_file_system_files_GET : { [K in keyof typeof api_file_system_files_GET_response]: z.infer<typeof api_file_system_files_GET_response[K]> },
  api_file_system_files_POST : { [K in keyof typeof api_file_system_files_POST_response]: z.infer<typeof api_file_system_files_POST_response[K]> },
  api_file_system_files_fileId_DELETE : { [K in keyof typeof api_file_system_files_fileId_DELETE_response]: z.infer<typeof api_file_system_files_fileId_DELETE_response[K]> },
  api_file_system_files_fileId_GET : { [K in keyof typeof api_file_system_files_fileId_GET_response]: z.infer<typeof api_file_system_files_fileId_GET_response[K]> },
  api_file_system_files_fileId_PATCH : { [K in keyof typeof api_file_system_files_fileId_PATCH_response]: z.infer<typeof api_file_system_files_fileId_PATCH_response[K]> },
  api_health_GET : { [K in keyof typeof api_health_GET_response]: z.infer<typeof api_health_GET_response[K]> },
  api_leaderboard_system_GET : { [K in keyof typeof api_leaderboard_system_GET_response]: z.infer<typeof api_leaderboard_system_GET_response[K]> },
  api_learning_resource_system_external_resources_GET : { [K in keyof typeof api_learning_resource_system_external_resources_GET_response]: z.infer<typeof api_learning_resource_system_external_resources_GET_response[K]> },
  api_learning_resource_system_external_resources_POST : { [K in keyof typeof api_learning_resource_system_external_resources_POST_response]: z.infer<typeof api_learning_resource_system_external_resources_POST_response[K]> },
  api_learning_resource_system_external_resources_externalResourceId_DELETE : { [K in keyof typeof api_learning_resource_system_external_resources_externalResourceId_DELETE_response]: z.infer<typeof api_learning_resource_system_external_resources_externalResourceId_DELETE_response[K]> },
  api_learning_resource_system_external_resources_externalResourceId_GET : { [K in keyof typeof api_learning_resource_system_external_resources_externalResourceId_GET_response]: z.infer<typeof api_learning_resource_system_external_resources_externalResourceId_GET_response[K]> },
  api_learning_resource_system_external_resources_externalResourceId_PATCH : { [K in keyof typeof api_learning_resource_system_external_resources_externalResourceId_PATCH_response]: z.infer<typeof api_learning_resource_system_external_resources_externalResourceId_PATCH_response[K]> },
  api_learning_resource_system_GET : { [K in keyof typeof api_learning_resource_system_GET_response]: z.infer<typeof api_learning_resource_system_GET_response[K]> },
  api_learning_resource_system_study_jams_GET : { [K in keyof typeof api_learning_resource_system_study_jams_GET_response]: z.infer<typeof api_learning_resource_system_study_jams_GET_response[K]> },
  api_learning_resource_system_study_jams_POST : { [K in keyof typeof api_learning_resource_system_study_jams_POST_response]: z.infer<typeof api_learning_resource_system_study_jams_POST_response[K]> },
  api_learning_resource_system_study_jams_studyJamId_DELETE : { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_DELETE_response]: z.infer<typeof api_learning_resource_system_study_jams_studyJamId_DELETE_response[K]> },
  api_learning_resource_system_study_jams_studyJamId_GET : { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_GET_response]: z.infer<typeof api_learning_resource_system_study_jams_studyJamId_GET_response[K]> },
  api_learning_resource_system_study_jams_studyJamId_PATCH : { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_PATCH_response]: z.infer<typeof api_learning_resource_system_study_jams_studyJamId_PATCH_response[K]> },
  api_publication_system_articles_GET : { [K in keyof typeof api_publication_system_articles_GET_response]: z.infer<typeof api_publication_system_articles_GET_response[K]> },
  api_publication_system_articles_POST : { [K in keyof typeof api_publication_system_articles_POST_response]: z.infer<typeof api_publication_system_articles_POST_response[K]> },
  api_publication_system_articles_articleId_comments_GET : { [K in keyof typeof api_publication_system_articles_articleId_comments_GET_response]: z.infer<typeof api_publication_system_articles_articleId_comments_GET_response[K]> },
  api_publication_system_articles_articleId_comments_POST : { [K in keyof typeof api_publication_system_articles_articleId_comments_POST_response]: z.infer<typeof api_publication_system_articles_articleId_comments_POST_response[K]> },
  api_publication_system_articles_articleId_comments_commentId_DELETE : { [K in keyof typeof api_publication_system_articles_articleId_comments_commentId_DELETE_response]: z.infer<typeof api_publication_system_articles_articleId_comments_commentId_DELETE_response[K]> },
  api_publication_system_articles_articleId_DELETE : { [K in keyof typeof api_publication_system_articles_articleId_DELETE_response]: z.infer<typeof api_publication_system_articles_articleId_DELETE_response[K]> },
  api_publication_system_articles_articleId_GET : { [K in keyof typeof api_publication_system_articles_articleId_GET_response]: z.infer<typeof api_publication_system_articles_articleId_GET_response[K]> },
  api_publication_system_articles_articleId_PATCH : { [K in keyof typeof api_publication_system_articles_articleId_PATCH_response]: z.infer<typeof api_publication_system_articles_articleId_PATCH_response[K]> },
  api_publication_system_events_GET : { [K in keyof typeof api_publication_system_events_GET_response]: z.infer<typeof api_publication_system_events_GET_response[K]> },
  api_publication_system_events_POST : { [K in keyof typeof api_publication_system_events_POST_response]: z.infer<typeof api_publication_system_events_POST_response[K]> },
  api_publication_system_events_articleId_DELETE : { [K in keyof typeof api_publication_system_events_articleId_DELETE_response]: z.infer<typeof api_publication_system_events_articleId_DELETE_response[K]> },
  api_publication_system_events_articleId_GET : { [K in keyof typeof api_publication_system_events_articleId_GET_response]: z.infer<typeof api_publication_system_events_articleId_GET_response[K]> },
  api_publication_system_events_articleId_PATCH : { [K in keyof typeof api_publication_system_events_articleId_PATCH_response]: z.infer<typeof api_publication_system_events_articleId_PATCH_response[K]> },
  api_publication_system_highlights_GET : { [K in keyof typeof api_publication_system_highlights_GET_response]: z.infer<typeof api_publication_system_highlights_GET_response[K]> },
  api_publication_system_highlights_POST : { [K in keyof typeof api_publication_system_highlights_POST_response]: z.infer<typeof api_publication_system_highlights_POST_response[K]> },
  api_publication_system_highlights_highlightId_DELETE : { [K in keyof typeof api_publication_system_highlights_highlightId_DELETE_response]: z.infer<typeof api_publication_system_highlights_highlightId_DELETE_response[K]> },
  api_publication_system_highlights_highlightId_GET : { [K in keyof typeof api_publication_system_highlights_highlightId_GET_response]: z.infer<typeof api_publication_system_highlights_highlightId_GET_response[K]> },
  api_publication_system_highlights_highlightId_PATCH : { [K in keyof typeof api_publication_system_highlights_highlightId_PATCH_response]: z.infer<typeof api_publication_system_highlights_highlightId_PATCH_response[K]> },
  api_rbac_system_roles_GET : { [K in keyof typeof api_rbac_system_roles_GET_response]: z.infer<typeof api_rbac_system_roles_GET_response[K]> },
  api_rbac_system_roles_POST : { [K in keyof typeof api_rbac_system_roles_POST_response]: z.infer<typeof api_rbac_system_roles_POST_response[K]> },
  api_rbac_system_roles_roleId_DELETE : { [K in keyof typeof api_rbac_system_roles_roleId_DELETE_response]: z.infer<typeof api_rbac_system_roles_roleId_DELETE_response[K]> },
  api_rbac_system_roles_roleId_GET : { [K in keyof typeof api_rbac_system_roles_roleId_GET_response]: z.infer<typeof api_rbac_system_roles_roleId_GET_response[K]> },
  api_rbac_system_roles_roleId_PATCH : { [K in keyof typeof api_rbac_system_roles_roleId_PATCH_response]: z.infer<typeof api_rbac_system_roles_roleId_PATCH_response[K]> },
  api_rbac_system_roles_roleId_permissions_GET : { [K in keyof typeof api_rbac_system_roles_roleId_permissions_GET_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_GET_response[K]> },
  api_rbac_system_roles_roleId_permissions_POST : { [K in keyof typeof api_rbac_system_roles_roleId_permissions_POST_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_POST_response[K]> },
  api_rbac_system_roles_roleId_permissions_permissionId_DELETE : { [K in keyof typeof api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response[K]> },
  api_rbac_system_roles_roleId_permissions_permissionId_PATCH : { [K in keyof typeof api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response[K]> },
  api_reward_system_rewards_GET : { [K in keyof typeof api_reward_system_rewards_GET_response]: z.infer<typeof api_reward_system_rewards_GET_response[K]> },
  api_reward_system_rewards_POST : { [K in keyof typeof api_reward_system_rewards_POST_response]: z.infer<typeof api_reward_system_rewards_POST_response[K]> },
  api_reward_system_rewards_rewardId_claim_POST : { [K in keyof typeof api_reward_system_rewards_rewardId_claim_POST_response]: z.infer<typeof api_reward_system_rewards_rewardId_claim_POST_response[K]> },
  api_reward_system_rewards_rewardId_DELETE : { [K in keyof typeof api_reward_system_rewards_rewardId_DELETE_response]: z.infer<typeof api_reward_system_rewards_rewardId_DELETE_response[K]> },
  api_reward_system_rewards_rewardId_GET : { [K in keyof typeof api_reward_system_rewards_rewardId_GET_response]: z.infer<typeof api_reward_system_rewards_rewardId_GET_response[K]> },
  api_team_system_members_GET : { [K in keyof typeof api_team_system_members_GET_response]: z.infer<typeof api_team_system_members_GET_response[K]> },
  api_team_system_members_POST : { [K in keyof typeof api_team_system_members_POST_response]: z.infer<typeof api_team_system_members_POST_response[K]> },
  api_team_system_members_memberId_DELETE : { [K in keyof typeof api_team_system_members_memberId_DELETE_response]: z.infer<typeof api_team_system_members_memberId_DELETE_response[K]> },
  api_team_system_members_memberId_GET : { [K in keyof typeof api_team_system_members_memberId_GET_response]: z.infer<typeof api_team_system_members_memberId_GET_response[K]> },
  api_team_system_teams_GET : { [K in keyof typeof api_team_system_teams_GET_response]: z.infer<typeof api_team_system_teams_GET_response[K]> },
  api_team_system_teams_POST : { [K in keyof typeof api_team_system_teams_POST_response]: z.infer<typeof api_team_system_teams_POST_response[K]> },
  api_team_system_teams_teamId_DELETE : { [K in keyof typeof api_team_system_teams_teamId_DELETE_response]: z.infer<typeof api_team_system_teams_teamId_DELETE_response[K]> },
  api_team_system_teams_teamId_GET : { [K in keyof typeof api_team_system_teams_teamId_GET_response]: z.infer<typeof api_team_system_teams_teamId_GET_response[K]> },
  api_team_system_teams_teamId_PATCH : { [K in keyof typeof api_team_system_teams_teamId_PATCH_response]: z.infer<typeof api_team_system_teams_teamId_PATCH_response[K]> },
  api_user_resource_system_achivements_GET : { [K in keyof typeof api_user_resource_system_achivements_GET_response]: z.infer<typeof api_user_resource_system_achivements_GET_response[K]> },
  api_user_resource_system_achivements_POST : { [K in keyof typeof api_user_resource_system_achivements_POST_response]: z.infer<typeof api_user_resource_system_achivements_POST_response[K]> },
  api_user_resource_system_achivements_projectId_DELETE : { [K in keyof typeof api_user_resource_system_achivements_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_achivements_projectId_DELETE_response[K]> },
  api_user_resource_system_achivements_projectId_GET : { [K in keyof typeof api_user_resource_system_achivements_projectId_GET_response]: z.infer<typeof api_user_resource_system_achivements_projectId_GET_response[K]> },
  api_user_resource_system_achivements_projectId_PATCH : { [K in keyof typeof api_user_resource_system_achivements_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_achivements_projectId_PATCH_response[K]> },
  api_user_resource_system_certificates_GET : { [K in keyof typeof api_user_resource_system_certificates_GET_response]: z.infer<typeof api_user_resource_system_certificates_GET_response[K]> },
  api_user_resource_system_certificates_POST : { [K in keyof typeof api_user_resource_system_certificates_POST_response]: z.infer<typeof api_user_resource_system_certificates_POST_response[K]> },
  api_user_resource_system_certificates_projectId_DELETE : { [K in keyof typeof api_user_resource_system_certificates_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_certificates_projectId_DELETE_response[K]> },
  api_user_resource_system_certificates_projectId_GET : { [K in keyof typeof api_user_resource_system_certificates_projectId_GET_response]: z.infer<typeof api_user_resource_system_certificates_projectId_GET_response[K]> },
  api_user_resource_system_certificates_projectId_PATCH : { [K in keyof typeof api_user_resource_system_certificates_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_certificates_projectId_PATCH_response[K]> },
  api_user_resource_system_profiles_GET : { [K in keyof typeof api_user_resource_system_profiles_GET_response]: z.infer<typeof api_user_resource_system_profiles_GET_response[K]> },
  api_user_resource_system_profiles_POST : { [K in keyof typeof api_user_resource_system_profiles_POST_response]: z.infer<typeof api_user_resource_system_profiles_POST_response[K]> },
  api_user_resource_system_profiles_projectId_DELETE : { [K in keyof typeof api_user_resource_system_profiles_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_profiles_projectId_DELETE_response[K]> },
  api_user_resource_system_profiles_projectId_GET : { [K in keyof typeof api_user_resource_system_profiles_projectId_GET_response]: z.infer<typeof api_user_resource_system_profiles_projectId_GET_response[K]> },
  api_user_resource_system_profiles_projectId_PATCH : { [K in keyof typeof api_user_resource_system_profiles_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_profiles_projectId_PATCH_response[K]> },
  api_user_resource_system_projects_GET : { [K in keyof typeof api_user_resource_system_projects_GET_response]: z.infer<typeof api_user_resource_system_projects_GET_response[K]> },
  api_user_resource_system_projects_POST : { [K in keyof typeof api_user_resource_system_projects_POST_response]: z.infer<typeof api_user_resource_system_projects_POST_response[K]> },
  api_user_resource_system_projects_projectId_DELETE : { [K in keyof typeof api_user_resource_system_projects_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_projects_projectId_DELETE_response[K]> },
  api_user_resource_system_projects_projectId_GET : { [K in keyof typeof api_user_resource_system_projects_projectId_GET_response]: z.infer<typeof api_user_resource_system_projects_projectId_GET_response[K]> },
  api_user_resource_system_projects_projectId_PATCH : { [K in keyof typeof api_user_resource_system_projects_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_projects_projectId_PATCH_response[K]> },
  api_user_resource_system_settings_GET : { [K in keyof typeof api_user_resource_system_settings_GET_response]: z.infer<typeof api_user_resource_system_settings_GET_response[K]> },
  api_user_resource_system_settings_POST : { [K in keyof typeof api_user_resource_system_settings_POST_response]: z.infer<typeof api_user_resource_system_settings_POST_response[K]> },
  api_user_resource_system_settings_projectId_DELETE : { [K in keyof typeof api_user_resource_system_settings_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_settings_projectId_DELETE_response[K]> },
  api_user_resource_system_settings_projectId_GET : { [K in keyof typeof api_user_resource_system_settings_projectId_GET_response]: z.infer<typeof api_user_resource_system_settings_projectId_GET_response[K]> },
  api_user_resource_system_settings_projectId_PATCH : { [K in keyof typeof api_user_resource_system_settings_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_settings_projectId_PATCH_response[K]> },
  api_user_system_users_userId_aggregate_GET : { [K in keyof typeof api_user_system_users_userId_aggregate_GET_response]: z.infer<typeof api_user_system_users_userId_aggregate_GET_response[K]> },
  api_user_system_users_userId_GET : { [K in keyof typeof api_user_system_users_userId_GET_response]: z.infer<typeof api_user_system_users_userId_GET_response[K]> }
}
  
export type RequestTypes = {
  api_economy_system_transactions_GET : { [K in keyof typeof EndpointSchemas[ "api_economy_system_transactions_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_economy_system_transactions_GET" ]["request"][K]> },
  api_economy_system_wallets_GET : { [K in keyof typeof EndpointSchemas[ "api_economy_system_wallets_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_economy_system_wallets_GET" ]["request"][K]> },
  api_event_system_checkin_POST : { [K in keyof typeof EndpointSchemas[ "api_event_system_checkin_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_checkin_POST" ]["request"][K]> },
  api_event_system_events_GET : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_GET" ]["request"][K]> },
  api_event_system_events_POST : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_POST" ]["request"][K]> },
  api_event_system_events_eventId_attendees_GET : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_attendees_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_attendees_GET" ]["request"][K]> },
  api_event_system_events_eventId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_DELETE" ]["request"][K]> },
  api_event_system_events_eventId_GET : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_GET" ]["request"][K]> },
  api_event_system_events_eventId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_PATCH" ]["request"][K]> },
  api_file_system_files_GET : { [K in keyof typeof EndpointSchemas[ "api_file_system_files_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_GET" ]["request"][K]> },
  api_file_system_files_POST : { [K in keyof typeof EndpointSchemas[ "api_file_system_files_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_POST" ]["request"][K]> },
  api_file_system_files_fileId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_file_system_files_fileId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_fileId_DELETE" ]["request"][K]> },
  api_file_system_files_fileId_GET : { [K in keyof typeof EndpointSchemas[ "api_file_system_files_fileId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_fileId_GET" ]["request"][K]> },
  api_file_system_files_fileId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_file_system_files_fileId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_fileId_PATCH" ]["request"][K]> },
  api_health_GET : { [K in keyof typeof EndpointSchemas[ "api_health_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_health_GET" ]["request"][K]> },
  api_leaderboard_system_GET : { [K in keyof typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"][K]> },
  api_learning_resource_system_external_resources_GET : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_GET" ]["request"][K]> },
  api_learning_resource_system_external_resources_POST : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_POST" ]["request"][K]> },
  api_learning_resource_system_external_resources_externalResourceId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_DELETE" ]["request"][K]> },
  api_learning_resource_system_external_resources_externalResourceId_GET : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_GET" ]["request"][K]> },
  api_learning_resource_system_external_resources_externalResourceId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_PATCH" ]["request"][K]> },
  api_learning_resource_system_GET : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_GET" ]["request"][K]> },
  api_learning_resource_system_study_jams_GET : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_GET" ]["request"][K]> },
  api_learning_resource_system_study_jams_POST : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_POST" ]["request"][K]> },
  api_learning_resource_system_study_jams_studyJamId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_DELETE" ]["request"][K]> },
  api_learning_resource_system_study_jams_studyJamId_GET : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_GET" ]["request"][K]> },
  api_learning_resource_system_study_jams_studyJamId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_PATCH" ]["request"][K]> },
  api_publication_system_articles_GET : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_GET" ]["request"][K]> },
  api_publication_system_articles_POST : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_POST" ]["request"][K]> },
  api_publication_system_articles_articleId_comments_GET : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_GET" ]["request"][K]> },
  api_publication_system_articles_articleId_comments_POST : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_POST" ]["request"][K]> },
  api_publication_system_articles_articleId_comments_commentId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_commentId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_commentId_DELETE" ]["request"][K]> },
  api_publication_system_articles_articleId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_DELETE" ]["request"][K]> },
  api_publication_system_articles_articleId_GET : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_GET" ]["request"][K]> },
  api_publication_system_articles_articleId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_PATCH" ]["request"][K]> },
  api_publication_system_events_GET : { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_GET" ]["request"][K]> },
  api_publication_system_events_POST : { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_POST" ]["request"][K]> },
  api_publication_system_events_articleId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_articleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_articleId_DELETE" ]["request"][K]> },
  api_publication_system_events_articleId_GET : { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_articleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_articleId_GET" ]["request"][K]> },
  api_publication_system_events_articleId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_articleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_articleId_PATCH" ]["request"][K]> },
  api_publication_system_highlights_GET : { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_GET" ]["request"][K]> },
  api_publication_system_highlights_POST : { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_POST" ]["request"][K]> },
  api_publication_system_highlights_highlightId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_DELETE" ]["request"][K]> },
  api_publication_system_highlights_highlightId_GET : { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_GET" ]["request"][K]> },
  api_publication_system_highlights_highlightId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_PATCH" ]["request"][K]> },
  api_rbac_system_roles_GET : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_GET" ]["request"][K]> },
  api_rbac_system_roles_POST : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_POST" ]["request"][K]> },
  api_rbac_system_roles_roleId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_DELETE" ]["request"][K]> },
  api_rbac_system_roles_roleId_GET : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_GET" ]["request"][K]> },
  api_rbac_system_roles_roleId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_PATCH" ]["request"][K]> },
  api_rbac_system_roles_roleId_permissions_GET : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_GET" ]["request"][K]> },
  api_rbac_system_roles_roleId_permissions_POST : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_POST" ]["request"][K]> },
  api_rbac_system_roles_roleId_permissions_permissionId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_DELETE" ]["request"][K]> },
  api_rbac_system_roles_roleId_permissions_permissionId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_PATCH" ]["request"][K]> },
  api_reward_system_rewards_GET : { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_GET" ]["request"][K]> },
  api_reward_system_rewards_POST : { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_POST" ]["request"][K]> },
  api_reward_system_rewards_rewardId_claim_POST : { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_claim_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_claim_POST" ]["request"][K]> },
  api_reward_system_rewards_rewardId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_DELETE" ]["request"][K]> },
  api_reward_system_rewards_rewardId_GET : { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_GET" ]["request"][K]> },
  api_team_system_members_GET : { [K in keyof typeof EndpointSchemas[ "api_team_system_members_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_GET" ]["request"][K]> },
  api_team_system_members_POST : { [K in keyof typeof EndpointSchemas[ "api_team_system_members_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_POST" ]["request"][K]> },
  api_team_system_members_memberId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_team_system_members_memberId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_memberId_DELETE" ]["request"][K]> },
  api_team_system_members_memberId_GET : { [K in keyof typeof EndpointSchemas[ "api_team_system_members_memberId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_memberId_GET" ]["request"][K]> },
  api_team_system_teams_GET : { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_GET" ]["request"][K]> },
  api_team_system_teams_POST : { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_POST" ]["request"][K]> },
  api_team_system_teams_teamId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_teamId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_teamId_DELETE" ]["request"][K]> },
  api_team_system_teams_teamId_GET : { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_teamId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_teamId_GET" ]["request"][K]> },
  api_team_system_teams_teamId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_teamId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_teamId_PATCH" ]["request"][K]> },
  api_user_resource_system_achivements_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_GET" ]["request"][K]> },
  api_user_resource_system_achivements_POST : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_POST" ]["request"][K]> },
  api_user_resource_system_achivements_projectId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_DELETE" ]["request"][K]> },
  api_user_resource_system_achivements_projectId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_GET" ]["request"][K]> },
  api_user_resource_system_achivements_projectId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_PATCH" ]["request"][K]> },
  api_user_resource_system_certificates_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_GET" ]["request"][K]> },
  api_user_resource_system_certificates_POST : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_POST" ]["request"][K]> },
  api_user_resource_system_certificates_projectId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_DELETE" ]["request"][K]> },
  api_user_resource_system_certificates_projectId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_GET" ]["request"][K]> },
  api_user_resource_system_certificates_projectId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_PATCH" ]["request"][K]> },
  api_user_resource_system_profiles_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_GET" ]["request"][K]> },
  api_user_resource_system_profiles_POST : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_POST" ]["request"][K]> },
  api_user_resource_system_profiles_projectId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_DELETE" ]["request"][K]> },
  api_user_resource_system_profiles_projectId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_GET" ]["request"][K]> },
  api_user_resource_system_profiles_projectId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_PATCH" ]["request"][K]> },
  api_user_resource_system_projects_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_GET" ]["request"][K]> },
  api_user_resource_system_projects_POST : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_POST" ]["request"][K]> },
  api_user_resource_system_projects_projectId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_DELETE" ]["request"][K]> },
  api_user_resource_system_projects_projectId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_GET" ]["request"][K]> },
  api_user_resource_system_projects_projectId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_PATCH" ]["request"][K]> },
  api_user_resource_system_settings_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_GET" ]["request"][K]> },
  api_user_resource_system_settings_POST : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_POST" ]["request"][K]> },
  api_user_resource_system_settings_projectId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_DELETE" ]["request"][K]> },
  api_user_resource_system_settings_projectId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_GET" ]["request"][K]> },
  api_user_resource_system_settings_projectId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_PATCH" ]["request"][K]> },
  api_user_system_users_userId_aggregate_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_aggregate_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_aggregate_GET" ]["request"][K]> },
  api_user_system_users_userId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"][K]> }
}

export type EndpointTypes = {
    "api_economy_system_transactions_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_economy_system_transactions_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_economy_system_transactions_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_economy_system_transactions_GET_response]: z.infer<typeof api_economy_system_transactions_GET_response[K]> };
       },
    "api_economy_system_wallets_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_economy_system_wallets_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_economy_system_wallets_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_economy_system_wallets_GET_response]: z.infer<typeof api_economy_system_wallets_GET_response[K]> };
       },
    "api_event_system_checkin_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_event_system_checkin_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_checkin_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_event_system_checkin_POST_response]: z.infer<typeof api_event_system_checkin_POST_response[K]> };
       },
    "api_event_system_events_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_event_system_events_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_event_system_events_GET_response]: z.infer<typeof api_event_system_events_GET_response[K]> };
       },
    "api_event_system_events_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_event_system_events_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_event_system_events_POST_response]: z.infer<typeof api_event_system_events_POST_response[K]> };
       },
    "api_event_system_events_eventId_attendees_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_attendees_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_attendees_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_event_system_events_eventId_attendees_GET_response]: z.infer<typeof api_event_system_events_eventId_attendees_GET_response[K]> };
       },
    "api_event_system_events_eventId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_event_system_events_eventId_DELETE_response]: z.infer<typeof api_event_system_events_eventId_DELETE_response[K]> };
       },
    "api_event_system_events_eventId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_event_system_events_eventId_GET_response]: z.infer<typeof api_event_system_events_eventId_GET_response[K]> };
       },
    "api_event_system_events_eventId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_event_system_events_eventId_PATCH_response]: z.infer<typeof api_event_system_events_eventId_PATCH_response[K]> };
       },
    "api_file_system_files_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_file_system_files_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_file_system_files_GET_response]: z.infer<typeof api_file_system_files_GET_response[K]> };
       },
    "api_file_system_files_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_file_system_files_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_file_system_files_POST_response]: z.infer<typeof api_file_system_files_POST_response[K]> };
       },
    "api_file_system_files_fileId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_file_system_files_fileId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_fileId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_file_system_files_fileId_DELETE_response]: z.infer<typeof api_file_system_files_fileId_DELETE_response[K]> };
       },
    "api_file_system_files_fileId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_file_system_files_fileId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_fileId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_file_system_files_fileId_GET_response]: z.infer<typeof api_file_system_files_fileId_GET_response[K]> };
       },
    "api_file_system_files_fileId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_file_system_files_fileId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_file_system_files_fileId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_file_system_files_fileId_PATCH_response]: z.infer<typeof api_file_system_files_fileId_PATCH_response[K]> };
       },
    "api_health_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_health_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_health_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_health_GET_response]: z.infer<typeof api_health_GET_response[K]> };
       },
    "api_leaderboard_system_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_leaderboard_system_GET_response]: z.infer<typeof api_leaderboard_system_GET_response[K]> };
       },
    "api_learning_resource_system_external_resources_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_external_resources_GET_response]: z.infer<typeof api_learning_resource_system_external_resources_GET_response[K]> };
       },
    "api_learning_resource_system_external_resources_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_external_resources_POST_response]: z.infer<typeof api_learning_resource_system_external_resources_POST_response[K]> };
       },
    "api_learning_resource_system_external_resources_externalResourceId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_external_resources_externalResourceId_DELETE_response]: z.infer<typeof api_learning_resource_system_external_resources_externalResourceId_DELETE_response[K]> };
       },
    "api_learning_resource_system_external_resources_externalResourceId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_external_resources_externalResourceId_GET_response]: z.infer<typeof api_learning_resource_system_external_resources_externalResourceId_GET_response[K]> };
       },
    "api_learning_resource_system_external_resources_externalResourceId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_external_resources_externalResourceId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_external_resources_externalResourceId_PATCH_response]: z.infer<typeof api_learning_resource_system_external_resources_externalResourceId_PATCH_response[K]> };
       },
    "api_learning_resource_system_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_GET_response]: z.infer<typeof api_learning_resource_system_GET_response[K]> };
       },
    "api_learning_resource_system_study_jams_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_study_jams_GET_response]: z.infer<typeof api_learning_resource_system_study_jams_GET_response[K]> };
       },
    "api_learning_resource_system_study_jams_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_study_jams_POST_response]: z.infer<typeof api_learning_resource_system_study_jams_POST_response[K]> };
       },
    "api_learning_resource_system_study_jams_studyJamId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_DELETE_response]: z.infer<typeof api_learning_resource_system_study_jams_studyJamId_DELETE_response[K]> };
       },
    "api_learning_resource_system_study_jams_studyJamId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_GET_response]: z.infer<typeof api_learning_resource_system_study_jams_studyJamId_GET_response[K]> };
       },
    "api_learning_resource_system_study_jams_studyJamId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_learning_resource_system_study_jams_studyJamId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_learning_resource_system_study_jams_studyJamId_PATCH_response]: z.infer<typeof api_learning_resource_system_study_jams_studyJamId_PATCH_response[K]> };
       },
    "api_publication_system_articles_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_GET_response]: z.infer<typeof api_publication_system_articles_GET_response[K]> };
       },
    "api_publication_system_articles_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_POST_response]: z.infer<typeof api_publication_system_articles_POST_response[K]> };
       },
    "api_publication_system_articles_articleId_comments_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_articleId_comments_GET_response]: z.infer<typeof api_publication_system_articles_articleId_comments_GET_response[K]> };
       },
    "api_publication_system_articles_articleId_comments_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_articleId_comments_POST_response]: z.infer<typeof api_publication_system_articles_articleId_comments_POST_response[K]> };
       },
    "api_publication_system_articles_articleId_comments_commentId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_commentId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_comments_commentId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_articleId_comments_commentId_DELETE_response]: z.infer<typeof api_publication_system_articles_articleId_comments_commentId_DELETE_response[K]> };
       },
    "api_publication_system_articles_articleId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_articleId_DELETE_response]: z.infer<typeof api_publication_system_articles_articleId_DELETE_response[K]> };
       },
    "api_publication_system_articles_articleId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_articleId_GET_response]: z.infer<typeof api_publication_system_articles_articleId_GET_response[K]> };
       },
    "api_publication_system_articles_articleId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_articles_articleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_articles_articleId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_articles_articleId_PATCH_response]: z.infer<typeof api_publication_system_articles_articleId_PATCH_response[K]> };
       },
    "api_publication_system_events_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_events_GET_response]: z.infer<typeof api_publication_system_events_GET_response[K]> };
       },
    "api_publication_system_events_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_events_POST_response]: z.infer<typeof api_publication_system_events_POST_response[K]> };
       },
    "api_publication_system_events_articleId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_articleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_articleId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_events_articleId_DELETE_response]: z.infer<typeof api_publication_system_events_articleId_DELETE_response[K]> };
       },
    "api_publication_system_events_articleId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_articleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_articleId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_events_articleId_GET_response]: z.infer<typeof api_publication_system_events_articleId_GET_response[K]> };
       },
    "api_publication_system_events_articleId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_events_articleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_events_articleId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_events_articleId_PATCH_response]: z.infer<typeof api_publication_system_events_articleId_PATCH_response[K]> };
       },
    "api_publication_system_highlights_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_highlights_GET_response]: z.infer<typeof api_publication_system_highlights_GET_response[K]> };
       },
    "api_publication_system_highlights_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_highlights_POST_response]: z.infer<typeof api_publication_system_highlights_POST_response[K]> };
       },
    "api_publication_system_highlights_highlightId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_highlights_highlightId_DELETE_response]: z.infer<typeof api_publication_system_highlights_highlightId_DELETE_response[K]> };
       },
    "api_publication_system_highlights_highlightId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_highlights_highlightId_GET_response]: z.infer<typeof api_publication_system_highlights_highlightId_GET_response[K]> };
       },
    "api_publication_system_highlights_highlightId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_publication_system_highlights_highlightId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_publication_system_highlights_highlightId_PATCH_response]: z.infer<typeof api_publication_system_highlights_highlightId_PATCH_response[K]> };
       },
    "api_rbac_system_roles_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_GET_response]: z.infer<typeof api_rbac_system_roles_GET_response[K]> };
       },
    "api_rbac_system_roles_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_POST_response]: z.infer<typeof api_rbac_system_roles_POST_response[K]> };
       },
    "api_rbac_system_roles_roleId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_roleId_DELETE_response]: z.infer<typeof api_rbac_system_roles_roleId_DELETE_response[K]> };
       },
    "api_rbac_system_roles_roleId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_roleId_GET_response]: z.infer<typeof api_rbac_system_roles_roleId_GET_response[K]> };
       },
    "api_rbac_system_roles_roleId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_roleId_PATCH_response]: z.infer<typeof api_rbac_system_roles_roleId_PATCH_response[K]> };
       },
    "api_rbac_system_roles_roleId_permissions_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_roleId_permissions_GET_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_GET_response[K]> };
       },
    "api_rbac_system_roles_roleId_permissions_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_roleId_permissions_POST_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_POST_response[K]> };
       },
    "api_rbac_system_roles_roleId_permissions_permissionId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_permissionId_DELETE_response[K]> };
       },
    "api_rbac_system_roles_roleId_permissions_permissionId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_rbac_system_roles_roleId_permissions_permissionId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response]: z.infer<typeof api_rbac_system_roles_roleId_permissions_permissionId_PATCH_response[K]> };
       },
    "api_reward_system_rewards_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_reward_system_rewards_GET_response]: z.infer<typeof api_reward_system_rewards_GET_response[K]> };
       },
    "api_reward_system_rewards_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_reward_system_rewards_POST_response]: z.infer<typeof api_reward_system_rewards_POST_response[K]> };
       },
    "api_reward_system_rewards_rewardId_claim_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_claim_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_claim_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_reward_system_rewards_rewardId_claim_POST_response]: z.infer<typeof api_reward_system_rewards_rewardId_claim_POST_response[K]> };
       },
    "api_reward_system_rewards_rewardId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_reward_system_rewards_rewardId_DELETE_response]: z.infer<typeof api_reward_system_rewards_rewardId_DELETE_response[K]> };
       },
    "api_reward_system_rewards_rewardId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_reward_system_rewards_rewardId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_reward_system_rewards_rewardId_GET_response]: z.infer<typeof api_reward_system_rewards_rewardId_GET_response[K]> };
       },
    "api_team_system_members_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_members_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_members_GET_response]: z.infer<typeof api_team_system_members_GET_response[K]> };
       },
    "api_team_system_members_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_members_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_members_POST_response]: z.infer<typeof api_team_system_members_POST_response[K]> };
       },
    "api_team_system_members_memberId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_members_memberId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_memberId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_members_memberId_DELETE_response]: z.infer<typeof api_team_system_members_memberId_DELETE_response[K]> };
       },
    "api_team_system_members_memberId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_members_memberId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_members_memberId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_members_memberId_GET_response]: z.infer<typeof api_team_system_members_memberId_GET_response[K]> };
       },
    "api_team_system_teams_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_teams_GET_response]: z.infer<typeof api_team_system_teams_GET_response[K]> };
       },
    "api_team_system_teams_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_teams_POST_response]: z.infer<typeof api_team_system_teams_POST_response[K]> };
       },
    "api_team_system_teams_teamId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_teamId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_teamId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_teams_teamId_DELETE_response]: z.infer<typeof api_team_system_teams_teamId_DELETE_response[K]> };
       },
    "api_team_system_teams_teamId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_teamId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_teamId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_teams_teamId_GET_response]: z.infer<typeof api_team_system_teams_teamId_GET_response[K]> };
       },
    "api_team_system_teams_teamId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_team_system_teams_teamId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_team_system_teams_teamId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_team_system_teams_teamId_PATCH_response]: z.infer<typeof api_team_system_teams_teamId_PATCH_response[K]> };
       },
    "api_user_resource_system_achivements_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_achivements_GET_response]: z.infer<typeof api_user_resource_system_achivements_GET_response[K]> };
       },
    "api_user_resource_system_achivements_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_achivements_POST_response]: z.infer<typeof api_user_resource_system_achivements_POST_response[K]> };
       },
    "api_user_resource_system_achivements_projectId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_achivements_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_achivements_projectId_DELETE_response[K]> };
       },
    "api_user_resource_system_achivements_projectId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_achivements_projectId_GET_response]: z.infer<typeof api_user_resource_system_achivements_projectId_GET_response[K]> };
       },
    "api_user_resource_system_achivements_projectId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_achivements_projectId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_achivements_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_achivements_projectId_PATCH_response[K]> };
       },
    "api_user_resource_system_certificates_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_certificates_GET_response]: z.infer<typeof api_user_resource_system_certificates_GET_response[K]> };
       },
    "api_user_resource_system_certificates_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_certificates_POST_response]: z.infer<typeof api_user_resource_system_certificates_POST_response[K]> };
       },
    "api_user_resource_system_certificates_projectId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_certificates_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_certificates_projectId_DELETE_response[K]> };
       },
    "api_user_resource_system_certificates_projectId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_certificates_projectId_GET_response]: z.infer<typeof api_user_resource_system_certificates_projectId_GET_response[K]> };
       },
    "api_user_resource_system_certificates_projectId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_certificates_projectId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_certificates_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_certificates_projectId_PATCH_response[K]> };
       },
    "api_user_resource_system_profiles_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_profiles_GET_response]: z.infer<typeof api_user_resource_system_profiles_GET_response[K]> };
       },
    "api_user_resource_system_profiles_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_profiles_POST_response]: z.infer<typeof api_user_resource_system_profiles_POST_response[K]> };
       },
    "api_user_resource_system_profiles_projectId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_profiles_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_profiles_projectId_DELETE_response[K]> };
       },
    "api_user_resource_system_profiles_projectId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_profiles_projectId_GET_response]: z.infer<typeof api_user_resource_system_profiles_projectId_GET_response[K]> };
       },
    "api_user_resource_system_profiles_projectId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_profiles_projectId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_profiles_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_profiles_projectId_PATCH_response[K]> };
       },
    "api_user_resource_system_projects_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_projects_GET_response]: z.infer<typeof api_user_resource_system_projects_GET_response[K]> };
       },
    "api_user_resource_system_projects_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_projects_POST_response]: z.infer<typeof api_user_resource_system_projects_POST_response[K]> };
       },
    "api_user_resource_system_projects_projectId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_projects_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_projects_projectId_DELETE_response[K]> };
       },
    "api_user_resource_system_projects_projectId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_projects_projectId_GET_response]: z.infer<typeof api_user_resource_system_projects_projectId_GET_response[K]> };
       },
    "api_user_resource_system_projects_projectId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_projects_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_projects_projectId_PATCH_response[K]> };
       },
    "api_user_resource_system_settings_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_settings_GET_response]: z.infer<typeof api_user_resource_system_settings_GET_response[K]> };
       },
    "api_user_resource_system_settings_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_settings_POST_response]: z.infer<typeof api_user_resource_system_settings_POST_response[K]> };
       },
    "api_user_resource_system_settings_projectId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_settings_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_settings_projectId_DELETE_response[K]> };
       },
    "api_user_resource_system_settings_projectId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_settings_projectId_GET_response]: z.infer<typeof api_user_resource_system_settings_projectId_GET_response[K]> };
       },
    "api_user_resource_system_settings_projectId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_settings_projectId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_user_resource_system_settings_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_settings_projectId_PATCH_response[K]> };
       },
    "api_user_system_users_userId_aggregate_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_aggregate_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_aggregate_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_aggregate_GET_response]: z.infer<typeof api_user_system_users_userId_aggregate_GET_response[K]> };
       },
    "api_user_system_users_userId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_GET_response]: z.infer<typeof api_user_system_users_userId_GET_response[K]> };
       }
}
  
export type Responses<T extends keyof ResponseTypes> = ResponseTypes[T];
export type Requests<T extends keyof RequestTypes> = RequestTypes[T];
export type Endpoints<T extends keyof EndpointTypes> = EndpointTypes[T];

