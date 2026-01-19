import { Header } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, FileText, TrendingUp, Users } from 'lucide-react';

const reports = [
  {
    id: 'portfolio-summary',
    name: 'Portfolio Summary',
    description: 'Overview of all active credit relationships',
    icon: BarChart3,
  },
  {
    id: 'dscr-trends',
    name: 'DSCR Trends',
    description: 'Historical DSCR analysis across portfolio',
    icon: TrendingUp,
  },
  {
    id: 'analyst-activity',
    name: 'Analyst Activity',
    description: 'Team productivity and workload metrics',
    icon: Users,
  },
  {
    id: 'adjustment-summary',
    name: 'Adjustment Summary',
    description: 'Most common adjustments and override patterns',
    icon: FileText,
  },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Reports" subtitle="Analytics and reporting tools" />

      <div className="flex-1 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <report.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{report.name}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Reports Coming Soon</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Advanced analytics and reporting features are under development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
