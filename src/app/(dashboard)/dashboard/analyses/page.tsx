import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { mockBorrowerGroups } from '@/data';
import { AnalysisStatus } from '@/types';

const statusConfig: Record<AnalysisStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  'data-review': { label: 'Data Review', variant: 'secondary' },
  adjustments: { label: 'Adjustments', variant: 'secondary' },
  relationship: { label: 'Relationship', variant: 'secondary' },
  'debt-service': { label: 'Debt Service', variant: 'secondary' },
  memo: { label: 'Memo', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'default' },
};

export default function AnalysesPage() {
  return (
    <div className="flex flex-col">
      <Header title="Analyses" subtitle="All credit analysis workflows">
        <Link href="/dashboard/analysis/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </Link>
      </Header>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>All Analyses</CardTitle>
            <CardDescription>View and manage all credit analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower Group</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entities</TableHead>
                  <TableHead>Analyst</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBorrowerGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[group.status].variant}>
                        {statusConfig[group.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{group.entities.length}</TableCell>
                    <TableCell>{group.analyst}</TableCell>
                    <TableCell>
                      {new Date(group.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/analysis/demo/review`}>
                        <Button variant="ghost" size="sm">
                          {group.status === 'completed' ? 'View' : 'Continue'}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
