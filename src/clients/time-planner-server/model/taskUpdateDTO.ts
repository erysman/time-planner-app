/**
 * Generated by orval v6.18.1 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import type { TaskUpdateDTOPriority } from './taskUpdateDTOPriority';

export interface TaskUpdateDTO {
  name?: string;
  startDay?: string | null;
  startTime?: string | null;
  durationMin?: number | null;
  priority?: TaskUpdateDTOPriority;
  projectId?: string | null;
}
