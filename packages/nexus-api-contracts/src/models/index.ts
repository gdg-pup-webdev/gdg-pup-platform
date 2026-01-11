import { EconomySystemModels } from "./economySystem/index.js";
import * as _userSystem from "./userSystem/index.js";
import * as _userResourceSystem from "./userResourceSystem/index.js";
import * as _resourceSystem from "./resourceSystem/index.js";
import * as _roleSystem from "./roleSystem/index.js";
import { EventSystemModels } from "./eventSystem/index.js";

export namespace Models {
  export import economySystem = EconomySystemModels;
  export import userSystem = _userSystem;
  export import userResourceSystem = _userResourceSystem;
  export import resourceSystem = _resourceSystem;
  export import roleSystem = _roleSystem;
  export import eventSystem = EventSystemModels;
}
