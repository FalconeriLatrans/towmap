import type { AllocationEventResult } from "../types/AllocationEvent";
import type { Participant } from "../types/Participant";

const preferenceKeys = ["preference1", "preference2", "preference3"] as const;

export function simulateAllocationEvent(
  participants: Participant[],
  cityIds: string[]
): AllocationEventResult {
  const availableCities = new Set(cityIds);
  const assignments: Record<string, string> = {};
  const issues: AllocationEventResult["issues"] = [];

  [...participants]
    .filter(participant => participant.isMember)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    .forEach(participant => {
      const preferences = preferenceKeys
        .map(key => participant[key])
        .filter((city): city is string => Boolean(city));

      if (!preferences.length) {
        issues.push({
          participantId: participant.id,
          participantName: participant.name,
          reason: "missing-preferences",
        });
        return;
      }

      const selectedCity = preferences.find(city => availableCities.has(city));

      if (!selectedCity) {
        issues.push({
          participantId: participant.id,
          participantName: participant.name,
          reason: "no-available-preference",
        });
        return;
      }

      assignments[selectedCity] = participant.id;
      availableCities.delete(selectedCity);
    });

  return { assignments, issues };
}
