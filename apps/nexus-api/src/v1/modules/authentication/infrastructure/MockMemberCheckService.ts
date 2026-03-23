import { IMemberCheckService } from "../domain/IMemberCheckService.js";

export class MockMemberCheckService extends IMemberCheckService {
  public isMemberMock: boolean = true;
  
  async isMember(email: string): Promise<boolean> {
    return this.isMemberMock;
  }
}
