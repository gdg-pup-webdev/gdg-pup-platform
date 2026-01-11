import {
  ApiTypes,
  callEndpoint,
  createContract,
  createExpressController,
} from "@packages/api-typing";
import { root } from "./routes/index.js";
import { Models } from "./models/index.js";
import { RequestHandler } from "express";

const Contract = createContract(root);
type ContractTypes = ApiTypes<typeof root>;

export { Models, Contract, type ContractTypes };

// const endpoint: RequestHandler = createExpressController(
//   Contract.userSystem.users.user.wallet.get,
//   async ({ input, output, ctx }) => {
//     return output(200, {
//       status: "success",
//       message: "User wallet fetched successfully",
//       data: {
//         balance: 1000,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         id: "wallet_12345",
//         user_id: input.params.userId,
//       },
//     });
//   }
// );

// const result = await callEndpoint(
//   "localhost:3000",
//   Contract.userSystem.users.user.wallet.get,
//   {
//     params: { userId: "user_12345" },
//     token: "my-auth-token",
//   }
// );

// if (result.status == 200) {
//     result.body.data.balance
// }

// if (result.status==99) {
//     result.body.data
// }