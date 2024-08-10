import { Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Attested as AttestedEvent, EAS } from "../generated/EAS/EAS";
import { Attestation, ResourceContent, VoteContent } from "../generated/schema";
import { BIGINT_ZERO, BYTES32_ZERO } from "./constants";
import { prepareDataForDecoding } from "./utils";

// Function to create Attestation entity with the Attestation struct format from smart contract
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

// Function to fetch or create a Resource Content entity from attestation
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
      resource.isScamCount = BIGINT_ZERO;
      resource.notScamCount = BIGINT_ZERO;
    } else {
      resource.name = "";
      resource.content = "";
      resource.contentHash = BYTES32_ZERO;
      resource.type = BIGINT_ZERO;
      resource.isScamCount = BIGINT_ZERO;
      resource.notScamCount = BIGINT_ZERO;
    }
  }
  resource.save();
  return resource;
}

// Function to get or create a Vote Content entity from attestation data
export function getOrCreateVoteContent(
  attestationUid: Bytes,
  resourceId: Bytes,
  data: Bytes
): VoteContent {
  // Reformat data for decoding
  const formattedData = prepareDataForDecoding(data);

  const decodedData = ethereum.decode("(bool,string,string)", formattedData);

  let vote = VoteContent.load(attestationUid);
  if (!vote) {
    vote = new VoteContent(attestationUid);

    // Populate Decoded data
    if (decodedData) {
      // Convert the decoded values to a Tuple and assign to entity
      const values = decodedData.toTuple();
      vote.resourceId = resourceId;
      vote.isScam = values.at(0).toBoolean();
      vote.reason = values.at(1).toString();
      vote.info = values.at(2).toString();
    } else {
      vote.resourceId = BYTES32_ZERO;
      vote.isScam = true;
      vote.reason = "";
      vote.info = "";
    }
  }
  vote.save();
  return vote;
}
