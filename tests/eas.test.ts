import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { Attestation } from "../generated/schema"
import { Attested as AttestedEvent } from "../generated/EAS/EAS"
import { handleAttested } from "../src/eas"
import { createAttestedEvent } from "./eas-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let attestedEvent = createAttestedEvent()
    handleAttested(attestedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Attested created and stored", () => {
    assert.entityCount("Attestation", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    // assert.fieldEquals(
    //   "AdminChanged",
    //   "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
    //   "previousAdmin",
    //   "0x0000000000000000000000000000000000000001"
    // )
    // assert.fieldEquals(
    //   "AdminChanged",
    //   "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
    //   "newAdmin",
    //   "0x0000000000000000000000000000000000000001"
    // )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
