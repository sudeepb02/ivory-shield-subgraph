import {
  Attested as AttestedEvent,
  Revoked as RevokedEvent,
} from "../generated/EAS/EAS";
import {
  BIGINT_ONE,
  BYTES32_ZERO,
  RESOURCE_CONTENT_SCHEMA,
  VOTE_CONTENT_SCHEMA,
} from "./constants";

import {
  getOrCreateAttestation,
  getOrCreateResourceContent,
  getOrCreateVoteContent,
} from "./attestation";

// Attested event handler - executed when the Attested event is emitted from smart contract
export function handleAttested(event: AttestedEvent): void {
  const attestationUid = event.params.uid;
  const schemaId = event.params.schemaUID;

  // Create an attestation with onchain data only for current app specific schemas
  if (
    schemaId.notEqual(RESOURCE_CONTENT_SCHEMA) &&
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
    const voteContent = getOrCreateVoteContent(
      attestationUid,
      attestation.data
    );

    // Pass data as empty as resource should already exist
    const resourceContent = getOrCreateResourceContent(
      voteContent.resourceId,
      BYTES32_ZERO
    );
    if (voteContent.isScam) {
      resourceContent.isScamCount =
        resourceContent.isScamCount.plus(BIGINT_ONE);
    } else {
      resourceContent.notScamCount =
        resourceContent.notScamCount.plus(BIGINT_ONE);
    }
    resourceContent.save();
  }
}

// Revoke event handler - executed when the Revoked event is emitted from smart contract
export function handleRevoked(event: RevokedEvent): void {}
