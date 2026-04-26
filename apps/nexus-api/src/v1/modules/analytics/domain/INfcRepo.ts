export abstract class INfcRepo {
    abstract getNfcIdByGdgId(gdgId: string): Promise<string | null>;
}