import type { backendInterface, PickupDropoffRecord } from '../backend';
import { Principal } from '@dfinity/principal';

export async function getAllPickupDropoffRecords(actor: backendInterface): Promise<PickupDropoffRecord[]> {
  return await actor.getAllPickupDropoffRecords();
}

export async function getPickupDropoffRecord(actor: backendInterface, id: string): Promise<PickupDropoffRecord | null> {
  return await actor.getPickupDropoffRecord(id);
}

export async function getPickupDropoffRecordsForStudent(
  actor: backendInterface,
  studentId: Principal
): Promise<PickupDropoffRecord[]> {
  return await actor.getPickupDropoffRecordsForStudent(studentId);
}

export async function createPickupDropoffRecord(actor: backendInterface, record: PickupDropoffRecord): Promise<void> {
  return await actor.createPickupDropoffRecord(record);
}

export async function updatePickupDropoffRecord(actor: backendInterface, record: PickupDropoffRecord): Promise<void> {
  return await actor.updatePickupDropoffRecord(record);
}
