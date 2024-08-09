import { SchemaRecord } from "../generated/schema";
import { Registered as RegisteredEvent } from "../generated/SchemaRegistry/SchemaRegistry";

export function handleRegistered(event: RegisteredEvent): void {
  let schemaRecord = SchemaRecord.load(event.params.schema.uid);
  if (!schemaRecord) {
    schemaRecord = new SchemaRecord(event.params.schema.uid);
    schemaRecord.resolver = event.params.schema.resolver;
    schemaRecord.revocable = event.params.schema.revocable;
    schemaRecord.schema = event.params.schema.schema;
    schemaRecord.save();
  }
}
