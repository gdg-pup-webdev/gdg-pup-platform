
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT. 
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {z} from "zod";

import { body as api_card_system_activate_POST_body } from "./routes/api/card-system/activate/POST";
import { response as api_card_system_activate_POST_response } from "./routes/api/card-system/activate/POST";
import { body as api_card_system_activate_cardUid_POST_body } from "./routes/api/card-system/activate/[cardUid]/POST";
import { response as api_card_system_activate_cardUid_POST_response } from "./routes/api/card-system/activate/[cardUid]/POST";
import { response as api_card_system_cards_cardUid_status_GET_response } from "./routes/api/card-system/cards/[cardUid]/status/GET";
import { response as api_health_GET_response } from "./routes/api/health/GET";
import { response as api_public_profile_users_handle_GET_response } from "./routes/api/public-profile/users/[handle]/GET";
import { CardModels as model_cardSystem_card_model_CardModels } from "./models/cardSystem/card.model";
import { CardModels as model_cardSystem_index_CardModels } from "./models/cardSystem/index";
import { CardTransactionModels as model_cardSystem_index_CardTransactionModels } from "./models/cardSystem/index";
import { CardTransactionModels as model_cardSystem_transaction_model_CardTransactionModels } from "./models/cardSystem/transaction.model";
import { Models as model_index_Models } from "./models//index";
import { UserModels as model_userSystem_index_UserModels } from "./models/userSystem/index";
import { UserProfileModels as model_userSystem_index_UserProfileModels } from "./models/userSystem/index";
import { UserProfileModels as model_userSystem_profile_model_UserProfileModels } from "./models/userSystem/profile.model";
import { UserModels as model_userSystem_user_model_UserModels } from "./models/userSystem/user.model";

export const EndpointSchemas = {
  "api_card_system_activate_POST": {
    "request": {
      "body": api_card_system_activate_POST_body
    },
    "response": api_card_system_activate_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/card-system/activate",
      "signature": "api_card_system_activate_POST"
    }
  },
  "api_card_system_activate_cardUid_POST": {
    "request": {
      "params": z.object({cardUid: z.string()}),
      "body": api_card_system_activate_cardUid_POST_body
    },
    "response": api_card_system_activate_cardUid_POST_response,
    "metadata": {
      "method": "POST",
      "path": "/api/card-system/activate/[cardUid]",
      "signature": "api_card_system_activate_cardUid_POST"
    }
  },
  "api_card_system_cards_cardUid_status_GET": {
    "request": {
      "params": z.object({cardUid: z.string()})
    },
    "response": api_card_system_cards_cardUid_status_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/card-system/cards/[cardUid]/status",
      "signature": "api_card_system_cards_cardUid_status_GET"
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
  "api_public_profile_users_handle_GET": {
    "request": {
      "params": z.object({handle: z.string()})
    },
    "response": api_public_profile_users_handle_GET_response,
    "metadata": {
      "method": "GET",
      "path": "/api/public-profile/users/[handle]",
      "signature": "api_public_profile_users_handle_GET"
    }
  }
}

export const contract = {
  "api": {
    "card_system": {
      "activate": {
        "POST": {
          "request": {
            "body": api_card_system_activate_POST_body
          },
          "response": api_card_system_activate_POST_response,
          "metadata": {
            "method": "POST",
            "path": "/api/card-system/activate",
            "signature": "api_card_system_activate_POST"
          }
        },
        "cardUid": {
          "POST": {
            "request": {
              "params": z.object({cardUid: z.string()}),
              "body": api_card_system_activate_cardUid_POST_body
            },
            "response": api_card_system_activate_cardUid_POST_response,
            "metadata": {
              "method": "POST",
              "path": "/api/card-system/activate/[cardUid]",
              "signature": "api_card_system_activate_cardUid_POST"
            }
          }
        }
      },
      "cards": {
        "cardUid": {
          "status": {
            "GET": {
              "request": {
                "params": z.object({cardUid: z.string()})
              },
              "response": api_card_system_cards_cardUid_status_GET_response,
              "metadata": {
                "method": "GET",
                "path": "/api/card-system/cards/[cardUid]/status",
                "signature": "api_card_system_cards_cardUid_status_GET"
              }
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
    "public_profile": {
      "users": {
        "handle": {
          "GET": {
            "request": {
              "params": z.object({handle: z.string()})
            },
            "response": api_public_profile_users_handle_GET_response,
            "metadata": {
              "method": "GET",
              "path": "/api/public-profile/users/[handle]",
              "signature": "api_public_profile_users_handle_GET"
            }
          }
        }
      }
    }
  }
}

export const models = {
  "cardSystem": {
    "card.model_model": model_cardSystem_card_model_CardModels,
    "index_model": model_cardSystem_index_CardTransactionModels,
    "transaction.model_model": model_cardSystem_transaction_model_CardTransactionModels
  },
  "index_model": model_index_Models,
  "userSystem": {
    "index_model": model_userSystem_index_UserProfileModels,
    "profile.model_model": model_userSystem_profile_model_UserProfileModels,
    "user.model_model": model_userSystem_user_model_UserModels
  }
}

export type ResponseTypes = {
  api_card_system_activate_POST : { [K in keyof typeof api_card_system_activate_POST_response]: z.infer<typeof api_card_system_activate_POST_response[K]> },
  api_card_system_activate_cardUid_POST : { [K in keyof typeof api_card_system_activate_cardUid_POST_response]: z.infer<typeof api_card_system_activate_cardUid_POST_response[K]> },
  api_card_system_cards_cardUid_status_GET : { [K in keyof typeof api_card_system_cards_cardUid_status_GET_response]: z.infer<typeof api_card_system_cards_cardUid_status_GET_response[K]> },
  api_health_GET : { [K in keyof typeof api_health_GET_response]: z.infer<typeof api_health_GET_response[K]> },
  api_public_profile_users_handle_GET : { [K in keyof typeof api_public_profile_users_handle_GET_response]: z.infer<typeof api_public_profile_users_handle_GET_response[K]> }
}
  
export type RequestTypes = {
  api_card_system_activate_POST : { [K in keyof typeof EndpointSchemas[ "api_card_system_activate_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_card_system_activate_POST" ]["request"][K]> },
  api_card_system_activate_cardUid_POST : { [K in keyof typeof EndpointSchemas[ "api_card_system_activate_cardUid_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_card_system_activate_cardUid_POST" ]["request"][K]> },
  api_card_system_cards_cardUid_status_GET : { [K in keyof typeof EndpointSchemas[ "api_card_system_cards_cardUid_status_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_card_system_cards_cardUid_status_GET" ]["request"][K]> },
  api_health_GET : { [K in keyof typeof EndpointSchemas[ "api_health_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_health_GET" ]["request"][K]> },
  api_public_profile_users_handle_GET : { [K in keyof typeof EndpointSchemas[ "api_public_profile_users_handle_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_public_profile_users_handle_GET" ]["request"][K]> }
}

export type EndpointTypes = {
    "api_card_system_activate_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_card_system_activate_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_card_system_activate_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_card_system_activate_POST_response]: z.infer<typeof api_card_system_activate_POST_response[K]> };
       },
    "api_card_system_activate_cardUid_POST": {
          request: { [K in keyof typeof EndpointSchemas[ "api_card_system_activate_cardUid_POST" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_card_system_activate_cardUid_POST" ]["request"][K]> };
        response: { [K in keyof typeof api_card_system_activate_cardUid_POST_response]: z.infer<typeof api_card_system_activate_cardUid_POST_response[K]> };
       },
    "api_card_system_cards_cardUid_status_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_card_system_cards_cardUid_status_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_card_system_cards_cardUid_status_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_card_system_cards_cardUid_status_GET_response]: z.infer<typeof api_card_system_cards_cardUid_status_GET_response[K]> };
       },
    "api_health_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_health_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_health_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_health_GET_response]: z.infer<typeof api_health_GET_response[K]> };
       },
    "api_public_profile_users_handle_GET": {
          request: { [K in keyof typeof EndpointSchemas[ "api_public_profile_users_handle_GET" ]["request"]]: z.infer<typeof EndpointSchemas[ "api_public_profile_users_handle_GET" ]["request"][K]> };
        response: { [K in keyof typeof api_public_profile_users_handle_GET_response]: z.infer<typeof api_public_profile_users_handle_GET_response[K]> };
       }
}
  
export type Responses<T extends keyof ResponseTypes> = ResponseTypes[T];
export type Requests<T extends keyof RequestTypes> = RequestTypes[T];
export type Endpoints<T extends keyof EndpointTypes> = EndpointTypes[T];

