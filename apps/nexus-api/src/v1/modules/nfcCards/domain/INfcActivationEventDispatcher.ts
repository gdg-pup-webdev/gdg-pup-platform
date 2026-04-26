export interface INfcActivationEventDispatcher {
  dispatchActivationSuccess(ownerGdgId: string, cardId: string): Promise<void>;
}
