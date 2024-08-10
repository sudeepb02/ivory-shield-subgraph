import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export const RESOURCE_CONTENT_SCHEMA = Bytes.fromHexString(
  "0xf9d154f29979ed121d8e7d80e147061c1ce904fdecf4e4fd2b54e8d13300c1e9"
);

export const VOTE_CONTENT_SCHEMA = Bytes.fromHexString(
  "0x1d42f089a296bc14f36c1bad49a74912893d1aeb201dd099914c52a6a6dd5265"
);

export const BYTES32_ZERO = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000000000000000000000000000000"
);

export const BIGINT_ZERO = BigInt.zero();
export const BIGINT_ONE = BigInt.fromI32(1);
