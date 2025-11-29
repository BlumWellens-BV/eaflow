import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID with an optional prefix
 * @param prefix - Optional prefix (e.g., 'elem', 'rel', 'view')
 * @returns ID in format prefix-uuid or just uuid
 */
export function generateId(prefix?: string): string {
  const uuid = uuidv4();
  return prefix ? `${prefix}-${uuid}` : uuid;
}
