import { Bytes } from "@graphprotocol/graph-ts";

// Subgraph AssemblyScript does not support direct decoding of encoded data
// This helper function will prepare the data for decoding according to the logic explained below:
// https://medium.com/@r2d2_68242/indexing-transaction-input-data-in-a-subgraph-6ff5c55abf20
export function prepareDataForDecoding(attestationData: Bytes): Bytes {
  // Remove 0x from the beginning of attestationData if present
  let data = attestationData.toHexString();
  if (data.startsWith("0x")) {
    data = data.slice(2);
  }
  
  const hexStringToDecode =
    "0000000000000000000000000000000000000000000000000000000000000020".concat(
      data
    );

  return Bytes.fromHexString(hexStringToDecode);
}
