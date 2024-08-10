import {
  Attested as AttestedEvent,
  Revoked as RevokedEvent,
} from "../generated/EAS/EAS";
import { RESOURCE_CONTENT_SCHEMA, VOTE_CONTENT_SCHEMA } from "./constants";

import {
  getOrCreateAttestation,
  getOrCreateResourceContent,
} from "./attestation";

// Attested event handler - executed when the Attested event is emitted from smart contract
export function handleAttested(event: AttestedEvent): void {
  const attestationUid = event.params.uid;
  const schemaId = event.params.schemaUID;

  // Create an attestation with onchain data only for current app specific schemas
  if (
    schemaId.notEqual(RESOURCE_CONTENT_SCHEMA) ||
    schemaId.notEqual(VOTE_CONTENT_SCHEMA)
  ) {
    return;
  }

  // Query and Store attestation data
  // Create generic attestation with on-chain data
  const attestation = getOrCreateAttestation(event);

  // Store Resource Content from Attestation
  if (schemaId.equals(RESOURCE_CONTENT_SCHEMA)) {
    // Create Resource Content
    const resourceContent = getOrCreateResourceContent(
      attestationUid,
      attestation.data
    );
  } else if (schemaId.equals(VOTE_CONTENT_SCHEMA)) {
    // Create Vote data from Attestation
  }
}

// Revoke event handler - executed when the Revoked event is emitted from smart contract
export function handleRevoked(event: RevokedEvent): void {}
