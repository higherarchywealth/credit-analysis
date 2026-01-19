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
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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

export default function DashboardPage() {
  const activeDeals = mockBorrowerGroups.filter((bg) => bg.status !== 'completed').length;
  const pendingReview = mockBorrowerGroups.filter((bg) => bg.status === 'data-review').length;
  const completedThisMonth = mockBorrowerGroups.filter((bg) => bg.status === 'completed').length;

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" subtitle="Overview of your credit analysis workflow">
        <Link href="/dashboard/analysis/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </Link>
      </Header>

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDeals}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReview}</div>
              <p className="text-xs text-muted-foreground">Awaiting data review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedThisMonth}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Your most recent borrower group analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower Group</TableHead>
                  <TableHead>Status</TableHead>
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
