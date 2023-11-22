import { RobynJobSetting } from '@/types/RobynJobSetting';

export function isSettingsValid(
  settings: Partial<RobynJobSetting> | undefined
): boolean {
  return (
    settings?.countryCode != null &&
    settings?.dateColumn != null &&
    settings?.depVarColumn != null &&
    settings?.depVarColumnType != null &&
    settings?.startDate != null &&
    settings?.endDate != null &&
    (settings?.paidMediaVars?.length ?? 0) > 0 &&
    (settings.paidMediaVars?.every(isValidPaidMediaVar) ?? true) &&
    (((settings?.organicVars?.length ?? 0) === 0 ||
      settings?.organicVars?.every(isValidOrganicVar)) ??
      true) &&
    (((settings?.contextVars?.length ?? 0) === 0 ||
      settings?.contextVars?.every(isValidContextVar)) ??
      true)
  );
}

function isValidPaidMediaVar(
  paidMedia: Required<RobynJobSetting>['paidMediaVars'][number]
) {
  return (
    paidMedia?.eventColumn != null &&
    paidMedia?.eventType != null &&
    paidMedia?.platform != null &&
    paidMedia?.spendColumn != null
  );
}

function isValidOrganicVar(
  paidMedia: Required<RobynJobSetting>['organicVars'][number]
) {
  return paidMedia?.eventColumn != null && paidMedia?.platform != null;
}

function isValidContextVar(
  paidMedia: Required<RobynJobSetting>['contextVars'][number]
) {
  return paidMedia?.eventColumn != null && paidMedia?.factorType != null;
}
