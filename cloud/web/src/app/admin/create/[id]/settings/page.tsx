'use client';

import { Combobox } from '@/components/form/Combobox';
import { DatePicker } from '@/components/form/DatePicker';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { COUNTRY_LIST } from '@/lib/countries';
import { DATA_TYPES } from '@/lib/dataTypes';
import { EVENT_TYPES } from '@/lib/eventTypes';
import { FACTOR_TYPES } from '@/lib/factorTypes';
import { JSON_FETCHER } from '@/lib/fetcher';
import { PLATFORMS } from '@/lib/platforms';
import { isSettingsValid } from '@/lib/settingsValidator';
import { RobynJob } from '@/types/RobynJob';
import { RobynJobSetting } from '@/types/RobynJobSetting';
import { Loader2, Plus, Trash } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { FormEventHandler, useEffect, useState } from 'react';
import useSWR from 'swr';

function ColumnSelector({
  label,
  columns,
  value,
  onChange,
}: {
  label: string;
  columns: string[];
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  const source = [
    {
      group: '',
      items: columns.map((d) => ({ value: d.trim(), label: d.trim() })),
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Combobox
        data={source}
        placeholderText="Select column name"
        notFoundText="Column not found"
        searchPlaceholderText="Search for column name"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function PlatformSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="platform">Platform</Label>
      <Combobox
        data={PLATFORMS}
        onChange={onChange}
        value={value}
        notFoundText="Platform not found"
        placeholderText="Select a platform"
        searchPlaceholderText="Search for a platform"
      />
    </div>
  );
}

function EventTypeSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="framework">Event type</Label>
      <Combobox
        data={EVENT_TYPES}
        value={value}
        onChange={onChange}
        notFoundText="Event type not found"
        placeholderText="Select event type"
        searchPlaceholderText="Search event type"
      />
    </div>
  );
}

function DataTypeSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-[300px]">
      <Label>Data type</Label>
      <Combobox
        data={DATA_TYPES}
        onChange={onChange}
        notFoundText="Data type not found"
        placeholderText="Select data type"
        searchPlaceholderText="Search for data type"
        value={value}
      />
    </div>
  );
}

function FactorTypeSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Data type</Label>
      <Combobox
        data={FACTOR_TYPES}
        onChange={onChange}
        notFoundText="Factor not found"
        placeholderText="Select a factor"
        searchPlaceholderText="Search for a factor"
        value={value}
      />
    </div>
  );
}

function CountrySelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  const data = [
    {
      group: '',
      items: Object.keys(COUNTRY_LIST).map((k) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return { value: k, label: COUNTRY_LIST[k] };
      }),
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Combobox
        data={data}
        notFoundText="Country not found"
        placeholderText="Select a country"
        value={value}
        onChange={onChange}
        searchPlaceholderText="Search for a country"
      />
    </div>
  );
}

type PaidMediaRowType = Required<RobynJobSetting>['paidMediaVars'][number];

function PaidMetricRow({
  columns,
  value,
  onChange,
  onRemoveRow,
}: {
  columns: string[];
  value: PaidMediaRowType | undefined;
  onChange: (v: PaidMediaRowType | undefined) => void;
  onRemoveRow: () => void;
}) {
  return (
    <div className="flex flex-row flex-1 w-8/12 items-end gap-4">
      <PlatformSelector
        value={value?.platform}
        onChange={(v) => {
          onChange({ ...(value ?? {}), platform: v });
        }}
      />
      <ColumnSelector
        label="Spend column"
        columns={columns}
        value={value?.spendColumn}
        onChange={(v) => {
          onChange({ ...(value ?? {}), spendColumn: v });
        }}
      />
      <EventTypeSelector
        value={value?.eventType}
        onChange={(v) => {
          onChange({ ...(value ?? {}), eventType: v });
        }}
      />
      <ColumnSelector
        label="Event column"
        columns={columns}
        value={value?.eventColumn}
        onChange={(v) => {
          onChange({ ...(value ?? {}), eventColumn: v });
        }}
      />
      <Button type="button" variant={'ghost'} onClick={onRemoveRow}>
        <Trash size={16} className="text-slate-600" />
      </Button>
    </div>
  );
}

type OrganicRowType = Required<RobynJobSetting>['organicVars'][number];

function OrganicMetricRow({
  columns,
  value,
  onRemoveRow,
  onChange,
}: {
  columns: string[];
  value: OrganicRowType | undefined;
  onChange: (v: OrganicRowType) => void;
  onRemoveRow: () => void;
}) {
  return (
    <div className="flex flex-row flex-1 w-8/12 items-end gap-4">
      <PlatformSelector
        value={value?.platform}
        onChange={(v) => {
          onChange({ ...(value ?? {}), platform: v });
        }}
      />
      <ColumnSelector
        label="Event column"
        columns={columns}
        value={value?.eventColumn}
        onChange={(v) => {
          onChange({ ...(value ?? {}), eventColumn: v });
        }}
      />
      <div>
        <Button type="button" variant={'ghost'} onClick={onRemoveRow}>
          <Trash size={16} className="text-slate-600" />
        </Button>
      </div>
    </div>
  );
}

type ExternalFactorRowType = Required<RobynJobSetting>['contextVars'][number];

function OtherExternalFactorsRow({
  columns,
  value,
  onRemoveRow,
  onChange,
}: {
  columns: string[];
  value: ExternalFactorRowType | undefined;
  onRemoveRow: () => void;
  onChange: (v: ExternalFactorRowType) => void;
}) {
  return (
    <div className="flex flex-row flex-1 w-8/12 items-end gap-4">
      <FactorTypeSelector
        value={value?.factorType}
        onChange={(v) => {
          onChange({ ...(value ?? {}), factorType: v });
        }}
      />
      <ColumnSelector
        label="Event column"
        columns={columns}
        value={value?.eventColumn}
        onChange={(v) => {
          onChange({ ...(value ?? {}), eventColumn: v });
        }}
      />
      <div>
        <Button type="button" variant="ghost" onClick={onRemoveRow}>
          <Trash size={16} className="text-slate-600" />
        </Button>
      </div>
    </div>
  );
}

const DEFAULT_SETTINGS = {
  iterations: 200,
  trials: 5,
  budget: 5_000_000,
};

function Page(): JSX.Element {
  const params = useParams();
  const data = useSWR<RobynJob>(`/api/jobs/${params.id}`, JSON_FETCHER);
  const columnData = data.data?.columns;
  const columns =
    columnData != null ? (JSON.parse(columnData) as string[]) : [];
  const router = useRouter();
  const [settings, setSettings] =
    useState<Partial<RobynJobSetting>>(DEFAULT_SETTINGS);
  const isValid = isSettingsValid(settings);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!data.isLoading && data.data?.settings) {
      const parsedSettings: Partial<RobynJobSetting> =
        data.data.settings != null
          ? (JSON.parse(data.data.settings) as Partial<RobynJobSetting>)
          : {};
      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
      });
    }
  }, [data.data?.settings, data.isLoading]);

  const onSettingsSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      await fetch(`/api/jobs/${params.id}`, {
        method: 'POST',
        body: JSON.stringify({
          settings: JSON.stringify(settings),
        }),
      });
    } finally {
      router.push(`/admin/create/${params.id}/progress`);
    }
  };

  return (
    <form onSubmit={onSettingsSubmit}>
      <div className="flex flex-col w-full h-full mb-4">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Analysis goals</CardTitle>
            <CardDescription>What are you trying to optimize?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center gap-4">
              <ColumnSelector
                label="Input data"
                columns={columns}
                value={settings?.depVarColumn}
                onChange={(v) => {
                  setSettings({ ...(settings ?? {}), depVarColumn: v });
                }}
              />
              <DataTypeSelector
                value={settings?.depVarColumnType}
                onChange={(v) => {
                  setSettings({ ...(settings ?? {}), depVarColumnType: v });
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Paid metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {settings?.paidMediaVars?.map((row, rowIndex) => (
                <PaidMetricRow
                  columns={columns}
                  key={rowIndex}
                  value={row}
                  onRemoveRow={() => {
                    setSettings({
                      ...(settings ?? {}),
                      paidMediaVars:
                        settings.paidMediaVars?.filter(
                          (_, itemIndex) => itemIndex !== rowIndex
                        ) ?? [],
                    });
                  }}
                  onChange={(v) => {
                    setSettings({
                      ...(settings ?? {}),
                      paidMediaVars:
                        settings.paidMediaVars?.map((currentItem, itemIndex) =>
                          itemIndex === rowIndex ? v ?? {} : currentItem
                        ) ?? [],
                    });
                  }}
                />
              ))}
            </div>
            <Button
              type="button"
              className="mt-3"
              variant="outline"
              onClick={() => {
                setSettings({
                  ...(settings ?? {}),
                  paidMediaVars: [...(settings?.paidMediaVars ?? []), {}],
                });
              }}
            >
              <Plus size={14} className="mr-2" /> Add
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Organic media metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {settings?.organicVars?.map((row, rowIndex) => (
                <OrganicMetricRow
                  columns={columns}
                  value={row}
                  key={rowIndex}
                  onRemoveRow={() => {
                    setSettings({
                      ...(settings ?? {}),
                      organicVars:
                        settings.organicVars?.filter(
                          (_, itemIndex) => itemIndex !== rowIndex
                        ) ?? [],
                    });
                  }}
                  onChange={(v) => {
                    setSettings({
                      ...(settings ?? {}),
                      organicVars:
                        settings.organicVars?.map((currentItem, itemIndex) =>
                          itemIndex === rowIndex ? v ?? {} : currentItem
                        ) ?? [],
                    });
                  }}
                />
              ))}
            </div>
            <Button
              type="button"
              className="mt-3"
              variant="outline"
              onClick={() => {
                setSettings({
                  ...(settings ?? {}),
                  organicVars: [...(settings?.organicVars ?? []), {}],
                });
              }}
            >
              <Plus size={14} className="mr-2" /> Add
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Other external factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {settings?.contextVars?.map((row, rowIndex) => (
                <OtherExternalFactorsRow
                  key={rowIndex}
                  value={row}
                  columns={columns}
                  onRemoveRow={() => {
                    setSettings({
                      ...(settings ?? {}),
                      contextVars:
                        settings.contextVars?.filter(
                          (_, itemIndex) => itemIndex !== rowIndex
                        ) ?? [],
                    });
                  }}
                  onChange={(v) => {
                    setSettings({
                      ...(settings ?? {}),
                      contextVars:
                        settings.contextVars?.map((currentItem, itemIndex) =>
                          itemIndex === rowIndex ? v ?? {} : currentItem
                        ) ?? [],
                    });
                  }}
                />
              ))}
            </div>
            <Button
              type="button"
              className="mt-3"
              variant="outline"
              onClick={() => {
                setSettings({
                  ...(settings ?? {}),
                  contextVars: [...(settings?.contextVars ?? []), {}],
                });
              }}
            >
              <Plus size={14} className="mr-2" /> Add
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row flex-1 w-8/12 items-end gap-4">
              <CountrySelector
                label="Holiday calendar"
                value={settings?.countryCode}
                onChange={(v) => {
                  setSettings({ ...(settings ?? {}), countryCode: v });
                }}
              />
              <ColumnSelector
                label="Input data"
                columns={columns}
                value={settings?.dateColumn}
                onChange={(v) => {
                  setSettings({ ...(settings ?? {}), dateColumn: v });
                }}
              />
              <div className="flex flex-col gap-1.5">
                <Label>Start Date</Label>
                <DatePicker
                  value={
                    settings?.startDate != null
                      ? new Date(settings?.startDate)
                      : undefined
                  }
                  onChange={(d) => {
                    setSettings({
                      ...(settings ?? {}),
                      startDate: d?.toISOString(),
                    });
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>End Date</Label>
                <DatePicker
                  value={
                    settings?.endDate != null
                      ? new Date(settings?.endDate)
                      : undefined
                  }
                  onChange={(d) => {
                    setSettings({
                      ...(settings ?? {}),
                      endDate: d?.toISOString(),
                    });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row flex-1 w-8/12 items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Iterations</Label>
                <Input
                  value={settings?.iterations ?? 200}
                  onChange={(v) => {
                    setSettings({
                      ...(settings ?? {}),
                      iterations: parseInt(v.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Trials</Label>
                <Input
                  value={settings?.trials ?? 5}
                  onChange={(v) => {
                    setSettings({
                      ...(settings ?? {}),
                      trials: parseInt(v.target.value),
                    });
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Budget</Label>
                <Input
                  value={settings?.budget ?? 5_000_000}
                  onChange={(v) => {
                    setSettings({
                      ...(settings ?? {}),
                      budget: parseInt(v.target.value),
                    });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-end">
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting && (
              <Loader2 size={16} className="animate-spin mr-2" />
            )}
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Page;
