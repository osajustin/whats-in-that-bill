/** Bill type codes from Congress.gov API (lowercase in DB). */
export const SENATE_BILL_TYPES = ["s", "sres", "sjres", "sconres"] as const;
export const HOUSE_BILL_TYPES = ["hr", "hres", "hjres", "hconres"] as const;

export type ChamberFilter = "all" | "senate" | "house";
