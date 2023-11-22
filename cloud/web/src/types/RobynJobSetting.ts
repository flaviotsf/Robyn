export type RobynJobSetting = Partial<{
  depVarColumn: string;
  depVarColumnType: string;
  countryCode: string;
  dateColumn: string;
  startDate: string;
  endDate: string;
  paidMediaVars: Array<
    Partial<{
      platform: string;
      spendColumn: string;
      eventType: string;
      eventColumn: string;
    }>
  >;
  organicVars: Array<
    Partial<{
      platform: string;
      eventColumn: string;
    }>
  >;
  contextVars: Array<
    Partial<{
      factorType: string;
      eventColumn: string;
    }>
  >;
  iterations: number;
  trials: number;
  budget: number;
}>;
