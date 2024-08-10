import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  Attested as AttestedEvent,
  EAS,
  Revoked as RevokedEvent,
} from "../generated/EAS/EAS";
import { Attestation, ResourceContent } from "../generated/schema";
import {
  BIGINT_ONE,
  BIGINT_ZERO,
  BYTES32_ZERO,
  IVORY_CONTENT_SCHEMA,
} from "./constants";
import { log } from "matchstick-as";

import { prepareDataForDecoding } from "./utils";

export function handleAttested(event: AttestedEvent): void {
  const attestationUid = event.params.uid;
  const schemaId = event.params.schemaUID;

  // Create an attestation only for this specific Schema UID
  if (schemaId.equals(IVORY_CONTENT_SCHEMA)) {
    // Query and Store attestation data
    const attestation = getOrCreateAttestation(event);

    // Create Resource Content
    const resourceContent = getOrCreateResourceContent(
      attestationUid,
      attestation.data
    );
    resourceContent.reportedCount =
      resourceContent.reportedCount.plus(BIGINT_ONE);
    resourceContent.save();
  }
}
export function handleRevoked(event: RevokedEvent): void {}

export function getOrCreateAttestation(event: AttestedEvent): Attestation {
  const attestationUid = event.params.uid;

  let attestation = Attestation.load(attestationUid);
  if (!attestation) {
    attestation = new Attestation(attestationUid);

    // Fetch attestation data from smart contract
    const easContract = EAS.bind(event.address);
    const res = easContract.try_getAttestation(attestationUid);
    if (!res.reverted) {
      const value = res.value;
      attestation.schema = value.schema;
      attestation.time = value.time;
      attestation.expirationTime = value.expirationTime;
      attestation.revocationTime = value.revocationTime;
      attestation.refUID = value.refUID;
      attestation.recipient = value.recipient;
      attestation.attester = value.attester;
      attestation.revocable = value.revocable;
      attestation.data = value.data;
    } else {
      attestation.schema = BYTES32_ZERO;
      attestation.time = event.block.timestamp;
      attestation.expirationTime = BIGINT_ZERO;
      attestation.revocationTime = BIGINT_ZERO;
      attestation.refUID = BYTES32_ZERO;
      attestation.recipient = BYTES32_ZERO;
      attestation.attester = BYTES32_ZERO;
      attestation.revocable = false;
      attestation.data = BYTES32_ZERO;
    }
    attestation.save();
  }
  return attestation;
}

export function getOrCreateResourceContent(
  attestationUid: Bytes,
  data: Bytes
): ResourceContent {
  // Reformat data for decoding
  const formattedData = prepareDataForDecoding(data);

  const decodedData = ethereum.decode(
    "(string,string,bytes32,uint8)",
    formattedData
  );

  let resource = ResourceContent.load(attestationUid);
  if (!resource) {
    resource = new ResourceContent(attestationUid);

    // Populate Decoded data
    if (decodedData) {
      // Convert the decoded values to a Tuple and assign to entity
      const values = decodedData.toTuple();
      resource.name = values.at(0).toString();
      resource.content = values.at(1).toString();
      resource.contentHash = values.at(2).toBytes();
      resource.type = values.at(3).toBigInt();
      resource.reportedCount = BIGINT_ZERO;
      resource.save();
    } else {
      resource.name = "";
      resource.content = "";
      resource.contentHash = BYTES32_ZERO;
      resource.type = BIGINT_ZERO;
      resource.reportedCount = BIGINT_ZERO;
      resource.save();
    }
  }
  return resource;
}
