import { Email } from "./Email";

export interface IMailerService {
  send(email: Email): Promise<void>;
}
