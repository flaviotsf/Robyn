'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RobynJob } from '@/types/RobynJob';
import { Button } from '@/components/ui/button';
import { LayoutTemplate, Loader2, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type DataTableSource = Pick<
  RobynJob,
  'id' | 'filename' | 'createdAt' | 'state' | 'columns'
>;

interface DataTableProps {
  data: Array<DataTableSource>;
}

export const columns: ColumnDef<DataTableSource>[] = [
  {
    accessorKey: 'id',
    header: 'Job ID',
  },
  {
    accessorKey: 'filename',
    header: 'Filename',
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ cell }) => {
      if (cell.getValue() === 'DRAFT') {
        return (
          <Badge variant="outline" className="justify-end">
            Draft
          </Badge>
        );
      }

      if (cell.getValue() === 'COMPLETED') {
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-500 border-green-500"
          >
            Completed
          </Badge>
        );
      }

      if (cell.getValue() === 'IN_PROGRESS') {
        return (
          <Badge variant="outline">
            <Loader2 size={14} className="animate-spin mr-2" />
            Processing
          </Badge>
        );
      }
      if (cell.getValue() === 'FAILED') {
        return <Badge variant="destructive">Failed</Badge>;
      }
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created Date',

    cell: ({ cell }) => {
      const date = cell.getValue() as Date;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
  {
    id: 'actions',
    header: () => {
      return <div className="text-right">Actions</div>;
    },
    cell: ({ row }) => {
      const state = row.getValue('state');
      const id = row.getValue('id');

      return (
        <div className="text-right">
          {state === 'DRAFT' && (
            <Button variant="outline" asChild>
              <Link href={`/admin/create/${id}/settings`}>
                <Settings size={14} className="mr-1" />
                Settings
              </Link>
            </Button>
          )}
          {state === 'FAILED' && (
            <Button variant="outline" asChild>
              <Link href={`/admin/create/${id}/progress`}>
                <Settings size={14} className="mr-1" />
                Settings
              </Link>
            </Button>
          )}
          {state === 'COMPLETED' && (
            <Button variant="outline" asChild>
              <Link href={`/admin/jobs/${id}`}>
                <LayoutTemplate size={14} className="mr-1" />
                View Report
              </Link>
            </Button>
          )}
        </div>
      );
    },
  },
];

export function JobDataTable({ data }: DataTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
