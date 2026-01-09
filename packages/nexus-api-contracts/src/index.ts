import {
  ApiTypes,
  createContract, 
} from "@packages/api-typing"; 
import { nexusApiRoutes } from "./contracts/index.js"; 

export const Contract = createContract(nexusApiRoutes);
export type ContractTypes = ApiTypes<typeof nexusApiRoutes>;
export * as Models from "./models/index.js";
 