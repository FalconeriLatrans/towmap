export type AllocationEventIssue = {
  participantId: string;
  participantName: string;
  reason: "missing-preferences" | "no-available-preference";
};

export type AllocationEventResult = {
  assignments: Record<string, string>;
  issues: AllocationEventIssue[];
};
