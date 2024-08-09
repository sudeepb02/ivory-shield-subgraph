import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Attested as AttestedEvent,
  Revoked as RevokedEvent,
} from "../generated/EAS/EAS";
import { AttestationRequestData } from "../generated/schema";

export function handleAttested(event: AttestedEvent): void {
  let attestation = AttestationRequestData.load(event.params.uid);
  if (!attestation) {
    attestation = new AttestationRequestData(event.params.uid);
    attestation.recipient = event.params.recipient;
    attestation.expirationTime = event.block.timestamp;
    attestation.revocable = true;
    attestation.refUID = Bytes.empty();
    attestation.data = event.params.schemaUID;
    attestation.value = BigInt.zero();
    attestation.save();
  }
}
export function handleRevoked(event: RevokedEvent): void {}
