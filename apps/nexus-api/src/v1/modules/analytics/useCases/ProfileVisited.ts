import { INfcScanRepository } from "../domain/INfcScanRepository";
import { IProfileViewRepository } from "../domain/IProfileViewRepository";
import {
  NfcScan,
  NfcScanInsertProps,
  NfcScanProps,
} from "../domain/NfcScan";
import {
  ProfileViewer,
  ProfileViewerInsertProps,
} from "../domain/ProfileViewer";

export class ProfileVisited {
  constructor(private readonly viewrepo: IProfileViewRepository) {}

  async execute(props: ProfileViewerInsertProps): Promise<ProfileViewer> {
    const viewer = ProfileViewer.create(props);
    await this.viewrepo.saveNew(viewer);
    return viewer;
  }
}
