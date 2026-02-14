import type { backendInterface, UserProfile, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

export async function getCallerUserProfile(actor: backendInterface): Promise<UserProfile | null> {
  return await actor.getCallerUserProfile();
}

export async function saveCallerUserProfile(actor: backendInterface, name: string): Promise<void> {
  return await actor.saveCallerUserProfile(name);
}

export async function getUserProfile(actor: backendInterface, user: Principal): Promise<UserProfile | null> {
  return await actor.getUserProfile(user);
}

export async function getAllUserProfiles(actor: backendInterface): Promise<UserProfile[]> {
  return await actor.getAllUserProfiles();
}

export async function assignUserRole(
  actor: backendInterface,
  user: Principal,
  role: UserRole
): Promise<void> {
  return await actor.assignUserRole(user, role);
}

export async function isCallerAdmin(actor: backendInterface): Promise<boolean> {
  return await actor.isCallerAdmin();
}
