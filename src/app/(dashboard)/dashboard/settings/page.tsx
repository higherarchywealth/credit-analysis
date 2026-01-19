'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  Trash2,
  GripVertical,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'dscr';

  // DSCR Config State
  const [dscrConfig, setDscrConfig] = useState({
    minimumDSCR: 1.25,
    marginalDSCR: 1.35,
    strongDSCR: 1.50,
    cashFlowMethod: 'ebitda',
    includeWorkingCapital: false,
    includeCapex: true,
    includeDistributions: true,
    debtServiceMethod: 'actual',
    useGlobalDSCR: true,
    includeGuarantorCashFlow: true,
    requireExceptionBelow: 1.25,
  });

  const [addBackRules, setAddBackRules] = useState([
    { id: '1', name: 'Non-recurring legal expenses', trigger: '> $25,000', category: 'non-recurring', enabled: true },
    { id: '2', name: 'Officer compensation normalization', trigger: '> $120,000', category: 'owner-comp', enabled: true },
    { id: '3', name: 'One-time insurance proceeds', trigger: '> $10,000', category: 'one-time', enabled: true },
    { id: '4', name: 'Related party rent adjustment', trigger: 'Below market', category: 'related-party', enabled: true },
    { id: '5', name: 'Depreciation add-back', trigger: 'Always', category: 'depreciation', enabled: false },
  ]);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Configure bank policies and preferences" />

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue={tabFromUrl} className="max-w-5xl">
          <TabsList>
            <TabsTrigger value="dscr">DSCR Config</TabsTrigger>
            <TabsTrigger value="rules">Add-back Rules</TabsTrigger>
            <TabsTrigger value="templates">Memo Templates</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* DSCR Configuration Tab */}
          <TabsContent value="dscr" className="mt-6 space-y-6">
            {/* DSCR Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle>DSCR Thresholds</CardTitle>
                <CardDescription>Define coverage ratio thresholds for policy compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="min-dscr" className="flex items-center gap-2">
                      Minimum DSCR
                      <Badge variant="destructive" className="text-xs">Policy Floor</Badge>
                    </Label>
                    <Input
                      id="min-dscr"
                      type="number"
                      step="0.05"
                      value={dscrConfig.minimumDSCR}
                      onChange={(e) => setDscrConfig({ ...dscrConfig, minimumDSCR: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">Below this requires exception</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marginal-dscr" className="flex items-center gap-2">
                      Marginal DSCR
                      <Badge variant="secondary" className="text-xs">Watch</Badge>
                    </Label>
                    <Input
                      id="marginal-dscr"
                      type="number"
                      step="0.05"
                      value={dscrConfig.marginalDSCR}
                      onChange={(e) => setDscrConfig({ ...dscrConfig, marginalDSCR: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">Flagged for additional review</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strong-dscr" className="flex items-center gap-2">
                      Strong DSCR
                      <Badge className="text-xs bg-green-600">Pass</Badge>
                    </Label>
                    <Input
                      id="strong-dscr"
                      type="number"
                      step="0.05"
                      value={dscrConfig.strongDSCR}
                      onChange={(e) => setDscrConfig({ ...dscrConfig, strongDSCR: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">Considered strong coverage</p>
                  </div>
                </div>

                {/* Visual threshold indicator */}
                <div className="mt-6 p-4 rounded-lg bg-muted">
                  <Label className="text-sm mb-3 block">Coverage Scale</Label>
                  <div className="relative h-8 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                    <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium text-white">
                      <span>0.00x</span>
                      <span>{dscrConfig.minimumDSCR}x</span>
                      <span>{dscrConfig.marginalDSCR}x</span>
                      <span>{dscrConfig.strongDSCR}x+</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Exception Required</span>
                    <span>Marginal</span>
                    <span>Acceptable</span>
                    <span>Strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Calculation */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Calculation Method</CardTitle>
                <CardDescription>Configure how operating cash flow is calculated for DSCR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Calculation Method</Label>
                    <Select
                      value={dscrConfig.cashFlowMethod}
                      onValueChange={(value) => setDscrConfig({ ...dscrConfig, cashFlowMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ebitda">EBITDA-Based</SelectItem>
                        <SelectItem value="uca">UCA Cash Flow</SelectItem>
                        <SelectItem value="traditional">Traditional (Net Income + D&A)</SelectItem>
                        <SelectItem value="custom">Custom Formula</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Debt Service Method</Label>
                    <Select
                      value={dscrConfig.debtServiceMethod}
                      onValueChange={(value) => setDscrConfig({ ...dscrConfig, debtServiceMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actual">Actual Payments (P&I)</SelectItem>
                        <SelectItem value="cpltd">CPLTD + Interest</SelectItem>
                        <SelectItem value="projected">Projected Debt Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base">Cash Flow Adjustments</Label>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <Label>Include Working Capital Changes</Label>
                        <p className="text-sm text-muted-foreground">
                          Adjust for changes in AR, inventory, and AP
                        </p>
                      </div>
                      <Switch
                        checked={dscrConfig.includeWorkingCapital}
                        onCheckedChange={(checked) => setDscrConfig({ ...dscrConfig, includeWorkingCapital: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <Label>Deduct Capital Expenditures</Label>
                        <p className="text-sm text-muted-foreground">
                          Subtract maintenance capex from cash flow
                        </p>
                      </div>
                      <Switch
                        checked={dscrConfig.includeCapex}
                        onCheckedChange={(checked) => setDscrConfig({ ...dscrConfig, includeCapex: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <Label>Deduct Distributions / Dividends</Label>
                        <p className="text-sm text-muted-foreground">
                          Subtract owner distributions from available cash
                        </p>
                      </div>
                      <Switch
                        checked={dscrConfig.includeDistributions}
                        onCheckedChange={(checked) => setDscrConfig({ ...dscrConfig, includeDistributions: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Global DSCR Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Global DSCR Settings</CardTitle>
                <CardDescription>Configure how global debt service coverage is calculated across entities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <Label>Enable Global DSCR Calculation</Label>
                    <p className="text-sm text-muted-foreground">
                      Combine cash flows across multiple entities and guarantors
                    </p>
                  </div>
                  <Switch
                    checked={dscrConfig.useGlobalDSCR}
                    onCheckedChange={(checked) => setDscrConfig({ ...dscrConfig, useGlobalDSCR: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <Label>Include Guarantor Personal Cash Flow</Label>
                    <p className="text-sm text-muted-foreground">
                      Add guarantor income (net of personal debt service) to global calculation
                    </p>
                  </div>
                  <Switch
                    checked={dscrConfig.includeGuarantorCashFlow}
                    onCheckedChange={(checked) => setDscrConfig({ ...dscrConfig, includeGuarantorCashFlow: checked })}
                  />
                </div>

                {/* Formula Preview */}
                <div className="p-4 rounded-lg bg-muted font-mono text-sm">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">Formula Preview</Label>
                  <div className="space-y-1">
                    <p><span className="text-green-600">Global Cash Flow</span> = Sum of Entity Cash Flows {dscrConfig.includeGuarantorCashFlow && '+ Guarantor Net Cash Flow'}</p>
                    <p><span className="text-red-600">Global Debt Service</span> = Sum of All P&I Payments</p>
                    <p><span className="text-blue-600">Global DSCR</span> = Global Cash Flow / Global Debt Service</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                Changes will apply to all new analyses
              </div>
              <Button onClick={handleSave} className="min-w-32">
                {saved ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Add-back Rules Tab */}
          <TabsContent value="rules" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Add-back Rules</CardTitle>
                    <CardDescription>
                      Configure automatic adjustment rules for financial normalization
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Trigger Condition</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addBackRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        </TableCell>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{rule.trigger}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rule.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) =>
                              setAddBackRules((prev) =>
                                prev.map((r) => (r.id === rule.id ? { ...r, enabled: checked } : r))
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Rule Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Rule Categories</CardTitle>
                <CardDescription>Organize adjustment rules by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: 'Non-recurring', count: 2, color: 'bg-red-100 text-red-800' },
                    { name: 'Owner Compensation', count: 1, color: 'bg-blue-100 text-blue-800' },
                    { name: 'One-time Events', count: 1, color: 'bg-yellow-100 text-yellow-800' },
                    { name: 'Related Party', count: 1, color: 'bg-purple-100 text-purple-800' },
                    { name: 'Depreciation', count: 1, color: 'bg-gray-100 text-gray-800' },
                    { name: 'Other', count: 0, color: 'bg-green-100 text-green-800' },
                  ].map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">{cat.name}</span>
                      <Badge className={cat.color}>{cat.count} rules</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memo Templates Tab */}
          <TabsContent value="templates" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Memo Section Templates</CardTitle>
                <CardDescription>
                  Customize auto-generated commentary for each memo section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Business Overview', description: 'Company background and history' },
                  { name: 'Financial Performance', description: 'Revenue, profitability, and trends' },
                  { name: 'Global Cash Flow', description: 'Combined cash flow analysis' },
                  { name: 'DSCR Analysis', description: 'Coverage ratio commentary' },
                  { name: 'Policy Exceptions', description: 'Exception language if required' },
                  { name: 'Recommendation', description: 'Approval recommendation template' },
                ].map((section) => (
                  <div key={section.name} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label>{section.name}</Label>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commentary Triggers</CardTitle>
                <CardDescription>
                  Conditions that trigger specific commentary in the memo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <Label>Revenue decline &gt; 10% YoY</Label>
                        <p className="text-sm text-muted-foreground">Requires explanation</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <Label>DSCR below policy minimum</Label>
                        <p className="text-sm text-muted-foreground">Triggers exception language</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <Label>Liquidity ratio deterioration</Label>
                        <p className="text-sm text-muted-foreground">Commentary on working capital</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage users and their roles</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'Sarah Johnson', email: 'sjohnson@bankdemo.com', role: 'Analyst', status: 'Active' },
                      { name: 'Michael Chen', email: 'mchen@bankdemo.com', role: 'Admin', status: 'Active' },
                      { name: 'Emily Davis', email: 'edavis@bankdemo.com', role: 'Reviewer', status: 'Active' },
                    ].map((user) => (
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Define what each role can do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { role: 'Analyst', perms: ['Create analyses', 'Edit own analyses', 'View all analyses'] },
                    { role: 'Reviewer', perms: ['View all analyses', 'Approve analyses', 'Add comments'] },
                    { role: 'Admin', perms: ['All permissions', 'Manage users', 'Configure settings'] },
                  ].map((r) => (
                    <div key={r.role} className="p-4 rounded-lg border">
                      <Label className="text-base">{r.role}</Label>
                      <ul className="mt-2 space-y-1">
                        {r.perms.map((p) => (
                          <li key={p} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
