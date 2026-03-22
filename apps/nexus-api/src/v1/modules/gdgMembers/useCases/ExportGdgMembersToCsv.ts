import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";

export class ExportGdgMembersToCsv {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(): Promise<string> {
    // For export, we might want to get all members. 
    // Since our repo is paginated, we loop through or assume a large page size for simplicity in this prototype
    // In a real system, we'd use a stream or a dedicated "findAllUnpaginated" method.
    const { list } = await this.repo.findAll(1, 10000); 
    
    const headers = ["id", "gdgId", "email", "program", "department", "displayName", "firstName", "lastName", "suffix"];
    const csvRows = [headers.join(",")];

    for (const member of list) {
      const p = member.props;
      const row = [
        p.id,
        p.gdgId,
        p.email,
        p.program,
        p.department,
        p.displayName,
        p.firstName,
        p.lastName,
        p.suffix || ""
      ];
      csvRows.push(row.join(","));
    }

    return csvRows.join("\n");
  }
}
