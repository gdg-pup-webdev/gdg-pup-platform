import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { AddGdgMember, AddGdgMemberInput } from "./AddGdgMember";

export class ImportGdgMembersFromCsv {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(csvContent: string): Promise<{ success: number; failed: number; errors: any[] }> {
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) return { success: 0, failed: 0, errors: ["Empty or invalid CSV"] };

    const headers = lines[0].split(",").map(h => h.trim());
    const results = { success: 0, failed: 0, errors: [] as any[] };
    
    const addUseCase = new AddGdgMember(this.repo);

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      if (values.length < headers.length) continue;

      const data: any = {};
      headers.forEach((header, index) => {
        data[header] = values[index];
      });

      // Map CSV headers to AddGdgMemberInput
      const input: AddGdgMemberInput = {
        gdgId: data.gdgId || "",
        email: data.email || "",
        program: data.program || "",
        department: data.department || "",
        displayName: data.displayName || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        suffix: data.suffix || null,
      };

      try {
        await addUseCase.execute(input);
        results.success++;
      } catch (err: any) {
        results.failed++;
        results.errors.push({ line: i + 1, error: err.message });
      }
    }

    return results;
  }
}
