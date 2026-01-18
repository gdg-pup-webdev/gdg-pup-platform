
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
// RUN "pnpm contract-gen -i ./src/routes -o ./src/contract.ts" TO SYNC CHANGES.

import {z} from "zod";

import { response as api_health_GET_response } from "./routes/api/health/GET";
import { getResponseModel as model_response_model_getResponseModel } from "./models//response.model";


export const contract = {
  "api": {
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
    }
  }
}

export namespace contract {
  export namespace api {
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
  }
}

export const models = {
  "response.model": {
    "getResponseModel": model_response_model_getResponseModel
  },
  "response.model_model": model_response_model_getResponseModel
}

export namespace models {
  export namespace response_model {
    export type getResponseModel = z.infer<typeof model_response_model_getResponseModel>;
  }
}

