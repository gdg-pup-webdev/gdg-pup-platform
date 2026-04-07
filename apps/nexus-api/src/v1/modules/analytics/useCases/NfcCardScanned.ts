import { INfcScanRepository } from "../domain/INfcScanRepository";
import {
  NfcScan,
  NfcScanInsertProps,
  NfcScanProps,
} from "../domain/NfcScan";

export class NfcCardScanned {
  constructor(private readonly scanrepo: INfcScanRepository) {}

  async execute(props: NfcScanInsertProps): Promise<NfcScan> {
    const nfcScan = NfcScan.create(props);
    await this.scanrepo.saveNew(nfcScan);
    return nfcScan;
  }
}
