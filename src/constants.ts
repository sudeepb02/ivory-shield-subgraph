import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export const RESOURCE_CONTENT_SCHEMA = Bytes.fromHexString(
  "0xf9d154f29979ed121d8e7d80e147061c1ce904fdecf4e4fd2b54e8d13300c1e9"
);

export const VOTE_CONTENT_SCHEMA = Bytes.fromHexString(
  "0xd5315809392500715f3506109907ae09ae62e113560b2fa9c7d739752581d6c9"
);

export const BYTES32_ZERO = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000000000000000000000000000000"
);

export const BIGINT_ZERO = BigInt.zero();
export const BIGINT_ONE = BigInt.fromI32(1);
