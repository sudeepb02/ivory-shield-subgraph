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
  // log.warning("Data from event {}", [data.toHexString()]);
  // const hardcodedData =
  //   "0x000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c010374164a3cfb2c4b26b427feb2087dc7df37f0a9afd7f56ac82e2e1db8c82e1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000104368617447505420426f74205363616d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b68747470733a2f2f7777772e796f75747562652e636f6d2f77617463683f763d5f432d7a7a6b3274567030000000000000000000000000000000000000000000";
  // log.warning("hardcodedData {}", [hardcodedData]);

  // // const tempData = Bytes.fromHexString(
  // //   "0x0000000000000000000000000000000000000000000000000000000000000020"
  // // ).concat(data);
  // const hexStringToDecode =
  //   "0x0000000000000000000000000000000000000000000000000000000000000020" +
  //   hardcodedData; // prepend tuple offset
  // const tempData = Bytes.fromByteArray(Bytes.fromHexString(hexStringToDecode));
  const tempData = Bytes.fromHexString(
    "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c010374164a3cfb2c4b26b427feb2087dc7df37f0a9afd7f56ac82e2e1db8c82e1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000104368617447505420426f74205363616d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b68747470733a2f2f7777772e796f75747562652e636f6d2f77617463683f763d5f432d7a7a6b3274567030000000000000000000000000000000000000000000"
  );

  const decodedData = ethereum.decode(
    "(string,string,bytes32,uint8)",
    tempData
  );

  let resource = ResourceContent.load(attestationUid);
  if (!resource) {
    resource = new ResourceContent(attestationUid);

    // Populate Decoded data
    if (decodedData) {
      log.warning("Decoded data kind {}", [decodedData.kind.toString()]); //Kind is Uint value 4
      log.warning("Decoded data value {}", [decodedData.data.toString()]); //Kind is Uint value 4

      const values = decodedData.toTuple();
      log.warning("Value 0: {}", [values.at(0).toString()]);
      log.warning("Value 1: {}", [values.at(1).toString()]);

      resource.name = values.at(0).toString();
      resource.content = values.at(1).toString();
      // resource.name = "A";
      // resource.content = "BCDE";
      resource.contentHash = BYTES32_ZERO;
      resource.type = BIGINT_ZERO;
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
