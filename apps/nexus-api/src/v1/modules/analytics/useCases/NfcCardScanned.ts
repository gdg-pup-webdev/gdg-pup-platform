import { INfcRepo } from "../domain/INfcRepo";
import { INfcScanRepository } from "../domain/INfcScanRepository";
import {
  NfcScan,
  NfcScanInsertProps,
  NfcScanProps,
} from "../domain/NfcScan";

export class NfcCardScanned {
  constructor(private readonly scanrepo: INfcScanRepository,
    private readonly nfcrepo : INfcRepo
  ) {}

  async execute(props: {
    ownerGdgId: string;
    scanContext?: string | null;
    scannerId?: string | null;
  }): Promise<NfcScan> {
    const nfcCardId = await this.nfcrepo.getNfcIdByGdgId(props.ownerGdgId);

    if (!nfcCardId) throw new Error("Owner GDG ID does not have a linked NFC card");
    const nfcScan = NfcScan.create({
      nfcCardId,
      scanContext: props.scanContext ?? null,
      scannerId: props.scannerId ?? null,
    });
    await this.scanrepo.saveNew(nfcScan);
    return nfcScan;
  }
}
