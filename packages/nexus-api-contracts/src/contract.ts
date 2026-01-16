
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT. 
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {z} from "zod";

import { query as api_article_system_articles_GET_query } from "./routes/api/article-system/articles/GET";
import { response as api_article_system_articles_GET_response } from "./routes/api/article-system/articles/GET";
import { body as api_article_system_articles_POST_body } from "./routes/api/article-system/articles/POST";
import { response as api_article_system_articles_POST_response } from "./routes/api/article-system/articles/POST";
import { response as api_article_system_articles_articleId_DELETE_response } from "./routes/api/article-system/articles/[articleId]/DELETE";
import { response as api_article_system_articles_articleId_GET_response } from "./routes/api/article-system/articles/[articleId]/GET";
import { body as api_article_system_articles_articleId_PATCH_body } from "./routes/api/article-system/articles/[articleId]/PATCH";
import { response as api_article_system_articles_articleId_PATCH_response } from "./routes/api/article-system/articles/[articleId]/PATCH";
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
import { response as api_health_GET_response } from "./routes/api/health/GET";
import { response as api_leaderboard_system_GET_response } from "./routes/api/leaderboard-system/GET";
import { query as api_resource_system_resources_GET_query } from "./routes/api/resource-system/resources/GET";
import { response as api_resource_system_resources_GET_response } from "./routes/api/resource-system/resources/GET";
import { body as api_resource_system_resources_POST_body } from "./routes/api/resource-system/resources/POST";
import { response as api_resource_system_resources_POST_response } from "./routes/api/resource-system/resources/POST";
import { response as api_resource_system_resources_resourceId_DELETE_response } from "./routes/api/resource-system/resources/[resourceId]/DELETE";
import { response as api_resource_system_resources_resourceId_GET_response } from "./routes/api/resource-system/resources/[resourceId]/GET";
import { body as api_resource_system_resources_resourceId_PATCH_body } from "./routes/api/resource-system/resources/[resourceId]/PATCH";
import { response as api_resource_system_resources_resourceId_PATCH_response } from "./routes/api/resource-system/resources/[resourceId]/PATCH";
import { query as api_user_resource_system_projects_GET_query } from "./routes/api/user-resource-system/projects/GET";
import { response as api_user_resource_system_projects_GET_response } from "./routes/api/user-resource-system/projects/GET";
import { body as api_user_resource_system_projects_POST_body } from "./routes/api/user-resource-system/projects/POST";
import { response as api_user_resource_system_projects_POST_response } from "./routes/api/user-resource-system/projects/POST";
import { response as api_user_resource_system_projects_projectId_DELETE_response } from "./routes/api/user-resource-system/projects/[projectId]/DELETE";
import { query as api_user_resource_system_projects_projectId_GET_query } from "./routes/api/user-resource-system/projects/[projectId]/GET";
import { response as api_user_resource_system_projects_projectId_GET_response } from "./routes/api/user-resource-system/projects/[projectId]/GET";
import { body as api_user_resource_system_projects_projectId_PATCH_body } from "./routes/api/user-resource-system/projects/[projectId]/PATCH";
import { response as api_user_resource_system_projects_projectId_PATCH_response } from "./routes/api/user-resource-system/projects/[projectId]/PATCH";
import { response as api_user_system_users_userId_GET_response } from "./routes/api/user-system/users/[userId]/GET";
import { response as api_user_system_users_userId_profile_GET_response } from "./routes/api/user-system/users/[userId]/profile/GET";
import { query as api_user_system_users_userId_projects_GET_query } from "./routes/api/user-system/users/[userId]/projects/GET";
import { response as api_user_system_users_userId_projects_GET_response } from "./routes/api/user-system/users/[userId]/projects/GET";
import { response as api_user_system_users_userId_roles_GET_response } from "./routes/api/user-system/users/[userId]/roles/GET";
import { response as api_user_system_users_userId_wallet_GET_response } from "./routes/api/user-system/users/[userId]/wallet/GET";
import { query as api_user_system_users_userId_wallet_transactions_GET_query } from "./routes/api/user-system/users/[userId]/wallet/transactions/GET";
import { response as api_user_system_users_userId_wallet_transactions_GET_response } from "./routes/api/user-system/users/[userId]/wallet/transactions/GET";
import { ArticleModels as model_articleSystem_article_model_ArticleModels } from "./models/articleSystem/article.model";
import { ArticleSystemModels as model_articleSystem_index_ArticleSystemModels } from "./models/articleSystem/index";
import { EconomySystemModels as model_economySystem_index_EconomySystemModels } from "./models/economySystem/index";
import { TransactionModels as model_economySystem_transaction_TransactionModels } from "./models/economySystem/transaction";
import { WalletModels as model_economySystem_wallet_WalletModels } from "./models/economySystem/wallet";
import { AttendanceModels as model_eventSystem_attendance_model_AttendanceModels } from "./models/eventSystem/attendance.model";
import { AttendeeModels as model_eventSystem_attendee_model_AttendeeModels } from "./models/eventSystem/attendee.model";
import { CheckinModels as model_eventSystem_checkin_model_CheckinModels } from "./models/eventSystem/checkin.model";
import { EventModels as model_eventSystem_event_model_EventModels } from "./models/eventSystem/event.model";
import { EventSystemModels as model_eventSystem_index_EventSystemModels } from "./models/eventSystem/index";
import { Models as model_index_Models } from "./models//index";
import { row as model_resourceSystem_resource_row } from "./models/resourceSystem/resource";
import { insertDTO as model_resourceSystem_resource_insertDTO } from "./models/resourceSystem/resource";
import { updateDTO as model_resourceSystem_resource_updateDTO } from "./models/resourceSystem/resource";
import { row as model_roleSystem_role_row } from "./models/roleSystem/role";
import { insertDTO as model_roleSystem_role_insertDTO } from "./models/roleSystem/role";
import { updateDTO as model_roleSystem_role_updateDTO } from "./models/roleSystem/role";
import { row as model_userResourceSystem_project_row } from "./models/userResourceSystem/project";
import { insertDTO as model_userResourceSystem_project_insertDTO } from "./models/userResourceSystem/project";
import { updateDTO as model_userResourceSystem_project_updateDTO } from "./models/userResourceSystem/project";
import { row as model_userSystem_profile_row } from "./models/userSystem/profile";
import { insertDTO as model_userSystem_profile_insertDTO } from "./models/userSystem/profile";
import { updateDTO as model_userSystem_profile_updateDTO } from "./models/userSystem/profile";
import { row as model_userSystem_user_row } from "./models/userSystem/user";
import { insertDTO as model_userSystem_user_insertDTO } from "./models/userSystem/user";
import { updateDTO as model_userSystem_user_updateDTO } from "./models/userSystem/user";

export const EndpointSchemas = {
  "api_article_system_articles_GET": {
    "request": {
      "query": api_article_system_articles_GET_query
    },
    "response": api_article_system_articles_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/article-system/articles",
      "signature": "api_article_system_articles_GET"
    }
  },
  "api_article_system_articles_POST": {
    "request": {
      "body": api_article_system_articles_POST_body
    },
    "response": api_article_system_articles_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/article-system/articles",
      "signature": "api_article_system_articles_POST"
    }
  },
  "api_article_system_articles_articleId_DELETE": {
    "request": {
      "params": z.object({articleId: z.string()})
    },
    "response": api_article_system_articles_articleId_DELETE_response,
    "metadata": {
      "method": "DELETE",
      "path": "/api/article-system/articles/[articleId]",
      "signature": "api_article_system_articles_articleId_DELETE"
    }
  },
  "api_article_system_articles_articleId_GET": {
    "request": {
      "params": z.object({articleId: z.string()})
    },
    "response": api_article_system_articles_articleId_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/article-system/articles/[articleId]",
      "signature": "api_article_system_articles_articleId_GET"
    }
  },
  "api_article_system_articles_articleId_PATCH": {
    "request": {
      "params": z.object({articleId: z.string()}),
      "body": api_article_system_articles_articleId_PATCH_body
    },
    "response": api_article_system_articles_articleId_PATCH_response,
    "metadata": {
      "method": "PATCH",
      "path": "/api/article-system/articles/[articleId]",
      "signature": "api_article_system_articles_articleId_PATCH"
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
  "api_resource_system_resources_GET": {
    "request": {
      "query": api_resource_system_resources_GET_query
    },
    "response": api_resource_system_resources_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/resource-system/resources",
      "signature": "api_resource_system_resources_GET"
    }
  },
  "api_resource_system_resources_POST": {
    "request": {
      "body": api_resource_system_resources_POST_body
    },
    "response": api_resource_system_resources_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/resource-system/resources",
      "signature": "api_resource_system_resources_POST"
    }
  },
  "api_resource_system_resources_resourceId_DELETE": {
    "request": {
      "params": z.object({resourceId: z.string()})
    },
    "response": api_resource_system_resources_resourceId_DELETE_response,
    "metadata": {
      "method": "DELETE",
      "path": "/api/resource-system/resources/[resourceId]",
      "signature": "api_resource_system_resources_resourceId_DELETE"
    }
  },
  "api_resource_system_resources_resourceId_GET": {
    "request": {
      "params": z.object({resourceId: z.string()})
    },
    "response": api_resource_system_resources_resourceId_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/resource-system/resources/[resourceId]",
      "signature": "api_resource_system_resources_resourceId_GET"
    }
  },
  "api_resource_system_resources_resourceId_PATCH": {
    "request": {
      "params": z.object({resourceId: z.string()}),
      "body": api_resource_system_resources_resourceId_PATCH_body
    },
    "response": api_resource_system_resources_resourceId_PATCH_response,
    "metadata": {
      "method": "PATCH",
      "path": "/api/resource-system/resources/[resourceId]",
      "signature": "api_resource_system_resources_resourceId_PATCH"
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
  },
  "api_user_system_users_userId_profile_GET": {
    "request": {
      "params": z.object({userId: z.string()})
    },
    "response": api_user_system_users_userId_profile_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/user-system/users/[userId]/profile",
      "signature": "api_user_system_users_userId_profile_GET"
    }
  },
  "api_user_system_users_userId_projects_GET": {
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
  },
  "api_user_system_users_userId_roles_GET": {
    "request": {
      "params": z.object({userId: z.string()})
    },
    "response": api_user_system_users_userId_roles_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/user-system/users/[userId]/roles",
      "signature": "api_user_system_users_userId_roles_GET"
    }
  },
  "api_user_system_users_userId_wallet_GET": {
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
  "api_user_system_users_userId_wallet_transactions_GET": {
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

export const contract = {
  "api": {
    "article_system": {
      "articles": {
        "GET": {
          "request": {
            "query": api_article_system_articles_GET_query
          },
          "response": api_article_system_articles_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/article-system/articles",
            "signature": "api_article_system_articles_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_article_system_articles_POST_body
          },
          "response": api_article_system_articles_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/article-system/articles",
            "signature": "api_article_system_articles_POST"
          }
        },
        "articleId": {
          "DELETE": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_article_system_articles_articleId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/article-system/articles/[articleId]",
              "signature": "api_article_system_articles_articleId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({articleId: z.string()})
            },
            "response": api_article_system_articles_articleId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/article-system/articles/[articleId]",
              "signature": "api_article_system_articles_articleId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({articleId: z.string()}),
              "body": api_article_system_articles_articleId_PATCH_body
            },
            "response": api_article_system_articles_articleId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/article-system/articles/[articleId]",
              "signature": "api_article_system_articles_articleId_PATCH"
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
    "resource_system": {
      "resources": {
        "GET": {
          "request": {
            "query": api_resource_system_resources_GET_query
          },
          "response": api_resource_system_resources_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/resource-system/resources",
            "signature": "api_resource_system_resources_GET"
          }
        },
        "POST": {
          "request": {
            "body": api_resource_system_resources_POST_body
          },
          "response": api_resource_system_resources_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/resource-system/resources",
            "signature": "api_resource_system_resources_POST"
          }
        },
        "resourceId": {
          "DELETE": {
            "request": {
              "params": z.object({resourceId: z.string()})
            },
            "response": api_resource_system_resources_resourceId_DELETE_response,
            "metadata": {
              "method": "DELETE",
              "path": "/api/resource-system/resources/[resourceId]",
              "signature": "api_resource_system_resources_resourceId_DELETE"
            }
          },
          "GET": {
            "request": {
              "params": z.object({resourceId: z.string()})
            },
            "response": api_resource_system_resources_resourceId_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/resource-system/resources/[resourceId]",
              "signature": "api_resource_system_resources_resourceId_GET"
            }
          },
          "PATCH": {
            "request": {
              "params": z.object({resourceId: z.string()}),
              "body": api_resource_system_resources_resourceId_PATCH_body
            },
            "response": api_resource_system_resources_resourceId_PATCH_response,
            "metadata": {
              "method": "PATCH",
              "path": "/api/resource-system/resources/[resourceId]",
              "signature": "api_resource_system_resources_resourceId_PATCH"
            }
          }
        }
      }
    },
    "user_resource_system": {
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

export const models = {
  "articleSystem": {
    "article.model_model": model_articleSystem_article_model_ArticleModels,
    "index_model": model_articleSystem_index_ArticleSystemModels
  },
  "economySystem": {
    "index_model": model_economySystem_index_EconomySystemModels,
    "transaction_model": model_economySystem_transaction_TransactionModels,
    "wallet_model": model_economySystem_wallet_WalletModels
  },
  "eventSystem": {
    "attendance.model_model": model_eventSystem_attendance_model_AttendanceModels,
    "attendee.model_model": model_eventSystem_attendee_model_AttendeeModels,
    "checkin.model_model": model_eventSystem_checkin_model_CheckinModels,
    "event.model_model": model_eventSystem_event_model_EventModels,
    "index_model": model_eventSystem_index_EventSystemModels
  },
  "index_model": model_index_Models,
  "resourceSystem": {
    "resource_model": model_resourceSystem_resource_updateDTO
  },
  "roleSystem": {
    "role_model": model_roleSystem_role_updateDTO
  },
  "userResourceSystem": {
    "project_model": model_userResourceSystem_project_updateDTO
  },
  "userSystem": {
    "profile_model": model_userSystem_profile_updateDTO,
    "user_model": model_userSystem_user_updateDTO
  }
}

export type ResponseTypes = {
  api_article_system_articles_GET : { [K in keyof typeof api_article_system_articles_GET_response]: z.infer<typeof api_article_system_articles_GET_response[K]> },
  api_article_system_articles_POST : { [K in keyof typeof api_article_system_articles_POST_response]: z.infer<typeof api_article_system_articles_POST_response[K]> },
  api_article_system_articles_articleId_DELETE : { [K in keyof typeof api_article_system_articles_articleId_DELETE_response]: z.infer<typeof api_article_system_articles_articleId_DELETE_response[K]> },
  api_article_system_articles_articleId_GET : { [K in keyof typeof api_article_system_articles_articleId_GET_response]: z.infer<typeof api_article_system_articles_articleId_GET_response[K]> },
  api_article_system_articles_articleId_PATCH : { [K in keyof typeof api_article_system_articles_articleId_PATCH_response]: z.infer<typeof api_article_system_articles_articleId_PATCH_response[K]> },
  api_event_system_checkin_POST : { [K in keyof typeof api_event_system_checkin_POST_response]: z.infer<typeof api_event_system_checkin_POST_response[K]> },
  api_event_system_events_GET : { [K in keyof typeof api_event_system_events_GET_response]: z.infer<typeof api_event_system_events_GET_response[K]> },
  api_event_system_events_POST : { [K in keyof typeof api_event_system_events_POST_response]: z.infer<typeof api_event_system_events_POST_response[K]> },
  api_event_system_events_eventId_attendees_GET : { [K in keyof typeof api_event_system_events_eventId_attendees_GET_response]: z.infer<typeof api_event_system_events_eventId_attendees_GET_response[K]> },
  api_event_system_events_eventId_DELETE : { [K in keyof typeof api_event_system_events_eventId_DELETE_response]: z.infer<typeof api_event_system_events_eventId_DELETE_response[K]> },
  api_event_system_events_eventId_GET : { [K in keyof typeof api_event_system_events_eventId_GET_response]: z.infer<typeof api_event_system_events_eventId_GET_response[K]> },
  api_event_system_events_eventId_PATCH : { [K in keyof typeof api_event_system_events_eventId_PATCH_response]: z.infer<typeof api_event_system_events_eventId_PATCH_response[K]> },
  api_health_GET : { [K in keyof typeof api_health_GET_response]: z.infer<typeof api_health_GET_response[K]> },
  api_leaderboard_system_GET : { [K in keyof typeof api_leaderboard_system_GET_response]: z.infer<typeof api_leaderboard_system_GET_response[K]> },
  api_resource_system_resources_GET : { [K in keyof typeof api_resource_system_resources_GET_response]: z.infer<typeof api_resource_system_resources_GET_response[K]> },
  api_resource_system_resources_POST : { [K in keyof typeof api_resource_system_resources_POST_response]: z.infer<typeof api_resource_system_resources_POST_response[K]> },
  api_resource_system_resources_resourceId_DELETE : { [K in keyof typeof api_resource_system_resources_resourceId_DELETE_response]: z.infer<typeof api_resource_system_resources_resourceId_DELETE_response[K]> },
  api_resource_system_resources_resourceId_GET : { [K in keyof typeof api_resource_system_resources_resourceId_GET_response]: z.infer<typeof api_resource_system_resources_resourceId_GET_response[K]> },
  api_resource_system_resources_resourceId_PATCH : { [K in keyof typeof api_resource_system_resources_resourceId_PATCH_response]: z.infer<typeof api_resource_system_resources_resourceId_PATCH_response[K]> },
  api_user_resource_system_projects_GET : { [K in keyof typeof api_user_resource_system_projects_GET_response]: z.infer<typeof api_user_resource_system_projects_GET_response[K]> },
  api_user_resource_system_projects_POST : { [K in keyof typeof api_user_resource_system_projects_POST_response]: z.infer<typeof api_user_resource_system_projects_POST_response[K]> },
  api_user_resource_system_projects_projectId_DELETE : { [K in keyof typeof api_user_resource_system_projects_projectId_DELETE_response]: z.infer<typeof api_user_resource_system_projects_projectId_DELETE_response[K]> },
  api_user_resource_system_projects_projectId_GET : { [K in keyof typeof api_user_resource_system_projects_projectId_GET_response]: z.infer<typeof api_user_resource_system_projects_projectId_GET_response[K]> },
  api_user_resource_system_projects_projectId_PATCH : { [K in keyof typeof api_user_resource_system_projects_projectId_PATCH_response]: z.infer<typeof api_user_resource_system_projects_projectId_PATCH_response[K]> },
  api_user_system_users_userId_GET : { [K in keyof typeof api_user_system_users_userId_GET_response]: z.infer<typeof api_user_system_users_userId_GET_response[K]> },
  api_user_system_users_userId_profile_GET : { [K in keyof typeof api_user_system_users_userId_profile_GET_response]: z.infer<typeof api_user_system_users_userId_profile_GET_response[K]> },
  api_user_system_users_userId_projects_GET : { [K in keyof typeof api_user_system_users_userId_projects_GET_response]: z.infer<typeof api_user_system_users_userId_projects_GET_response[K]> },
  api_user_system_users_userId_roles_GET : { [K in keyof typeof api_user_system_users_userId_roles_GET_response]: z.infer<typeof api_user_system_users_userId_roles_GET_response[K]> },
  api_user_system_users_userId_wallet_GET : { [K in keyof typeof api_user_system_users_userId_wallet_GET_response]: z.infer<typeof api_user_system_users_userId_wallet_GET_response[K]> },
  api_user_system_users_userId_wallet_transactions_GET : { [K in keyof typeof api_user_system_users_userId_wallet_transactions_GET_response]: z.infer<typeof api_user_system_users_userId_wallet_transactions_GET_response[K]> }
}
  
export type RequestTypes = {
  api_article_system_articles_GET : { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_GET" ]["request"][K]> },
  api_article_system_articles_POST : { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_POST" ]["request"][K]> },
  api_article_system_articles_articleId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_articleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_articleId_DELETE" ]["request"][K]> },
  api_article_system_articles_articleId_GET : { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_articleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_articleId_GET" ]["request"][K]> },
  api_article_system_articles_articleId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_articleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_articleId_PATCH" ]["request"][K]> },
  api_event_system_checkin_POST : { [K in keyof typeof EndpointSchemas[ "api_event_system_checkin_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_checkin_POST" ]["request"][K]> },
  api_event_system_events_GET : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_GET" ]["request"][K]> },
  api_event_system_events_POST : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_POST" ]["request"][K]> },
  api_event_system_events_eventId_attendees_GET : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_attendees_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_attendees_GET" ]["request"][K]> },
  api_event_system_events_eventId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_DELETE" ]["request"][K]> },
  api_event_system_events_eventId_GET : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_GET" ]["request"][K]> },
  api_event_system_events_eventId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_event_system_events_eventId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_event_system_events_eventId_PATCH" ]["request"][K]> },
  api_health_GET : { [K in keyof typeof EndpointSchemas[ "api_health_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_health_GET" ]["request"][K]> },
  api_leaderboard_system_GET : { [K in keyof typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"][K]> },
  api_resource_system_resources_GET : { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_GET" ]["request"][K]> },
  api_resource_system_resources_POST : { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_POST" ]["request"][K]> },
  api_resource_system_resources_resourceId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_resourceId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_resourceId_DELETE" ]["request"][K]> },
  api_resource_system_resources_resourceId_GET : { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_resourceId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_resourceId_GET" ]["request"][K]> },
  api_resource_system_resources_resourceId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_resourceId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_resourceId_PATCH" ]["request"][K]> },
  api_user_resource_system_projects_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_GET" ]["request"][K]> },
  api_user_resource_system_projects_POST : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_POST" ]["request"][K]> },
  api_user_resource_system_projects_projectId_DELETE : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_DELETE" ]["request"][K]> },
  api_user_resource_system_projects_projectId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_GET" ]["request"][K]> },
  api_user_resource_system_projects_projectId_PATCH : { [K in keyof typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_resource_system_projects_projectId_PATCH" ]["request"][K]> },
  api_user_system_users_userId_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"][K]> },
  api_user_system_users_userId_profile_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_profile_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_profile_GET" ]["request"][K]> },
  api_user_system_users_userId_projects_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_projects_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_projects_GET" ]["request"][K]> },
  api_user_system_users_userId_roles_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_roles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_roles_GET" ]["request"][K]> },
  api_user_system_users_userId_wallet_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_wallet_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_wallet_GET" ]["request"][K]> },
  api_user_system_users_userId_wallet_transactions_GET : { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_wallet_transactions_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_wallet_transactions_GET" ]["request"][K]> }
}

export type EndpointTypes = {
    "api_article_system_articles_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_article_system_articles_GET_response]: z.infer<typeof api_article_system_articles_GET_response[K]> };
       },
    "api_article_system_articles_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_article_system_articles_POST_response]: z.infer<typeof api_article_system_articles_POST_response[K]> };
       },
    "api_article_system_articles_articleId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_articleId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_articleId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_article_system_articles_articleId_DELETE_response]: z.infer<typeof api_article_system_articles_articleId_DELETE_response[K]> };
       },
    "api_article_system_articles_articleId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_articleId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_articleId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_article_system_articles_articleId_GET_response]: z.infer<typeof api_article_system_articles_articleId_GET_response[K]> };
       },
    "api_article_system_articles_articleId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_article_system_articles_articleId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_article_system_articles_articleId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_article_system_articles_articleId_PATCH_response]: z.infer<typeof api_article_system_articles_articleId_PATCH_response[K]> };
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
    "api_health_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_health_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_health_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_health_GET_response]: z.infer<typeof api_health_GET_response[K]> };
       },
    "api_leaderboard_system_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_leaderboard_system_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_leaderboard_system_GET_response]: z.infer<typeof api_leaderboard_system_GET_response[K]> };
       },
    "api_resource_system_resources_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_resource_system_resources_GET_response]: z.infer<typeof api_resource_system_resources_GET_response[K]> };
       },
    "api_resource_system_resources_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_resource_system_resources_POST_response]: z.infer<typeof api_resource_system_resources_POST_response[K]> };
       },
    "api_resource_system_resources_resourceId_DELETE": {
          request: { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_resourceId_DELETE" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_resourceId_DELETE" ]["request"][K]> };
        response: { [K in keyof typeof api_resource_system_resources_resourceId_DELETE_response]: z.infer<typeof api_resource_system_resources_resourceId_DELETE_response[K]> };
       },
    "api_resource_system_resources_resourceId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_resourceId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_resourceId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_resource_system_resources_resourceId_GET_response]: z.infer<typeof api_resource_system_resources_resourceId_GET_response[K]> };
       },
    "api_resource_system_resources_resourceId_PATCH": {
          request: { [K in keyof typeof EndpointSchemas[ "api_resource_system_resources_resourceId_PATCH" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_resource_system_resources_resourceId_PATCH" ]["request"][K]> };
        response: { [K in keyof typeof api_resource_system_resources_resourceId_PATCH_response]: z.infer<typeof api_resource_system_resources_resourceId_PATCH_response[K]> };
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
    "api_user_system_users_userId_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_GET_response]: z.infer<typeof api_user_system_users_userId_GET_response[K]> };
       },
    "api_user_system_users_userId_profile_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_profile_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_profile_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_profile_GET_response]: z.infer<typeof api_user_system_users_userId_profile_GET_response[K]> };
       },
    "api_user_system_users_userId_projects_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_projects_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_projects_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_projects_GET_response]: z.infer<typeof api_user_system_users_userId_projects_GET_response[K]> };
       },
    "api_user_system_users_userId_roles_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_roles_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_roles_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_roles_GET_response]: z.infer<typeof api_user_system_users_userId_roles_GET_response[K]> };
       },
    "api_user_system_users_userId_wallet_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_wallet_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_wallet_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_wallet_GET_response]: z.infer<typeof api_user_system_users_userId_wallet_GET_response[K]> };
       },
    "api_user_system_users_userId_wallet_transactions_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_user_system_users_userId_wallet_transactions_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_user_system_users_userId_wallet_transactions_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_user_system_users_userId_wallet_transactions_GET_response]: z.infer<typeof api_user_system_users_userId_wallet_transactions_GET_response[K]> };
       }
}
  
export type Responses<T extends keyof ResponseTypes> = ResponseTypes[T];
export type Requests<T extends keyof RequestTypes> = RequestTypes[T];
export type Endpoints<T extends keyof EndpointTypes> = EndpointTypes[T];

