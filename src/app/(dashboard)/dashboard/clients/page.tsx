import { Header } from '@/components/layout';
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
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { mockBorrowerGroups } from '@/data';

export default function ClientsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Clients" subtitle="Manage borrower groups and relationships">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </Header>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Borrower Groups</CardTitle>
            <CardDescription>All client relationships in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Entities</TableHead>
                  <TableHead>Guarantors</TableHead>
                  <TableHead>Analyst</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBorrowerGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{group.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{group.entities.length}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{group.guarantors.length}</Badge>
                    </TableCell>
                    <TableCell>{group.analyst}</TableCell>
                    <TableCell>
                      {new Date(group.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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
