import { newMockEvent } from "matchstick-as";
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts";
import { Attested } from "../generated/EAS/EAS";
import { BYTES32_ZERO } from "../src/constants";

export function createAttestedEvent(): Attested {
  let attestedEvent = changetype<Attested>(newMockEvent());

  attestedEvent.parameters = new Array();

  // 1. recipient
  attestedEvent.parameters.push(
    new ethereum.EventParam(
      "recipient",
      ethereum.Value.fromAddress(BYTES32_ZERO)
    )
  );
  attestedEvent.parameters.push(
    new ethereum.EventParam(
      "uid",
      ethereum.Value.fromBytes(
        Bytes.fromHexString(
          "0x29c1b15a18390f7ee0374d73442cfa1240a5d0842e77d81103059674912f376d"
        )
      )
    )
  );

  attestedEvent.parameters.push(
    new ethereum.EventParam(
      "schemaUID",
      ethereum.Value.fromBytes(
        Bytes.fromHexString(
          "0xf9d154f29979ed121d8e7d80e147061c1ce904fdecf4e4fd2b54e8d13300c1e9"
        )
      )
    )
  );

  return attestedEvent;
}
