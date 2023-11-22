import Link from 'next/link';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export type JobNavProps = {
  id: string;
  scenario: string;
  strategy?: string | undefined;
};

export function JobNav({ id, scenario, strategy }: JobNavProps) {
  return (
    <Card className="p-2 mb-4 gap-2 flex flex-row">
      <Button
        asChild
        variant={strategy == null ? 'secondary' : 'ghost'}
        className={strategy == null ? 'font-bold' : ''}
      >
        <Link href={`/admin/jobs/${id}/${scenario}`}>Overview</Link>
      </Button>
      <Button
        asChild
        variant={strategy == 'reallocated_best_roas' ? 'secondary' : 'ghost'}
        className={strategy == 'reallocated_best_roas' ? 'font-bold' : ''}
      >
        <Link href={`/admin/jobs/${id}/${scenario}/reallocated_best_roas`}>
          Best ROAS
        </Link>
      </Button>
      <Button
        asChild
        variant={strategy == 'reallocated_target_roas' ? 'secondary' : 'ghost'}
        className={strategy == 'reallocated_target_roas' ? 'font-bold' : ''}
      >
        <Link href={`/admin/jobs/${id}/${scenario}/reallocated_target_roas`}>
          Target ROAS
        </Link>
      </Button>
    </Card>
  );
}
