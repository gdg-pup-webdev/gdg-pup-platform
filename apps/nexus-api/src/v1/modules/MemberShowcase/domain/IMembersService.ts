export interface IMembersService {
  findByIds(ids: string[]): Promise<any[]>;
  exists(id: string): Promise<boolean>;
}
