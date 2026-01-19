'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight, Building2, User, Plus, Edit2, Trash2 } from 'lucide-react';
import { demoBorrowerGroup } from '@/data';

export default function RelationshipPage({ params }: { params: { id: string } }) {
  const [entities, setEntities] = useState(demoBorrowerGroup.entities);
  const [guarantors, setGuarantors] = useState(demoBorrowerGroup.guarantors);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Relationship Structure</h1>
          <p className="text-sm text-muted-foreground">
            Define entities, guarantors, and ownership for global DSCR calculation
          </p>
        </div>
        <Link href={`/dashboard/analysis/${params.id}/debt-service`}>
          <Button>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Borrower Group Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {demoBorrowerGroup.name}
              </CardTitle>
              <CardDescription>Borrower Group / Relationship</CardDescription>
            </CardHeader>
          </Card>

          {/* Entities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Operating Entities</CardTitle>
                  <CardDescription>Companies included in the analysis</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Entity
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Entity</DialogTitle>
                      <DialogDescription>
                        Add a new operating entity to this borrower group.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="entity-name">Entity Name</Label>
                        <Input id="entity-name" placeholder="e.g., Acme Manufacturing LLC" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entity-type">Entity Type</Label>
                        <Input id="entity-type" placeholder="e.g., Operating, Real Estate" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownership">Ownership %</Label>
                        <Input id="ownership" type="number" placeholder="100" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Entity</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{entity.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="capitalize">
                          {entity.type}
                        </Badge>
                        <span>{entity.ownershipPercent}% owned</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`include-${entity.id}`}
                        checked={entity.includeInGlobal}
                      />
                      <Label htmlFor={`include-${entity.id}`} className="text-sm">
                        Include in Global
                      </Label>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Guarantors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Guarantors</CardTitle>
                  <CardDescription>Personal guarantors and their obligations</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Guarantor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Guarantor</DialogTitle>
                      <DialogDescription>
                        Add a personal guarantor to this borrower group.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="guarantor-name">Full Name</Label>
                        <Input id="guarantor-name" placeholder="e.g., John Smith" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guarantor-ownership">Ownership %</Label>
                        <Input id="guarantor-ownership" type="number" placeholder="100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="personal-cash-flow">Annual Personal Cash Flow</Label>
                        <Input id="personal-cash-flow" type="number" placeholder="150000" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Add Guarantor</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {guarantors.map((guarantor) => (
                <div
                  key={guarantor.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{guarantor.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="capitalize">
                          {guarantor.type}
                        </Badge>
                        <span>{guarantor.ownershipPercent}% ownership</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        ${guarantor.personalCashFlow.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Annual Cash Flow</div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {guarantors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No guarantors added</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relationship Diagram */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ownership Structure</CardTitle>
              <CardDescription>Visual representation of the borrower relationship</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8">
                {/* Guarantor */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950 px-6 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{guarantors[0]?.name || 'Guarantor'}</span>
                    </div>
                    <div className="text-xs text-center text-muted-foreground">100% Owner</div>
                  </div>
                  <div className="h-8 w-0.5 bg-border" />
                </div>

                {/* Borrower Group */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg border-2 border-primary bg-primary/10 px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="font-medium">{demoBorrowerGroup.name}</span>
                    </div>
                    <div className="text-xs text-center text-muted-foreground">Borrower Group</div>
                  </div>
                  <div className="flex">
                    <div className="h-8 w-24 border-b border-l border-border" />
                    <div className="h-8 w-24 border-b border-r border-border" />
                  </div>
                </div>

                {/* Entities */}
                <div className="flex gap-8">
                  {entities.map((entity) => (
                    <div key={entity.id} className="flex flex-col items-center">
                      <div className="h-8 w-0.5 bg-border" />
                      <div className="rounded-lg border bg-card px-4 py-2 text-center">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-medium">{entity.name}</span>
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {entity.ownershipPercent}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
