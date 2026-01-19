'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  User,
  Plus,
  Minus,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';

// ============================================
// Types
// ============================================

type EntityType = 'operating' | 'holding' | 'real-estate';
type FileType = 'spreads' | 'uca' | 'pfs';
type FileStatus = 'uploading' | 'processing' | 'parsing' | 'complete' | 'error';

interface EntityDraft {
  id: string;
  name: string;
  type: EntityType;
  files: UploadedFile[];
}

interface GuarantorDraft {
  id: string;
  name: string;
  ownershipPercent: number;
  files: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  fileType: FileType;
  status: FileStatus;
  progress: number;
  stats?: { sheets: number; rows: number };
}

// ============================================
// Constants
// ============================================

const entityTypeLabels: Record<EntityType, string> = {
  operating: 'Operating Company',
  holding: 'Holding Company',
  'real-estate': 'Real Estate',
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Step 1: Borrower Group Setup
// ============================================

interface Step1Props {
  groupName: string;
  setGroupName: (name: string) => void;
  entityCount: number;
  setEntityCount: (count: number) => void;
  guarantorCount: number;
  setGuarantorCount: (count: number) => void;
  onNext: () => void;
}

function Step1({ groupName, setGroupName, entityCount, setEntityCount, guarantorCount, setGuarantorCount, onNext }: Step1Props) {
  const canProceed = groupName.trim().length > 0 && entityCount > 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Credit Analysis</CardTitle>
          <CardDescription>Define the borrower relationship structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Borrower Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Borrower Group Name</Label>
            <Input
              id="group-name"
              placeholder="e.g., Smith Holdings"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Entity Count */}
          <div className="space-y-2">
            <Label>How many borrowing entities?</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEntityCount(Math.max(1, entityCount - 1))}
                disabled={entityCount <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center w-16 h-10 rounded-md border bg-muted font-medium text-lg">
                {entityCount}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEntityCount(Math.min(10, entityCount + 1))}
                disabled={entityCount >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Operating companies, holding companies, etc.</span>
            </div>
          </div>

          {/* Guarantor Count */}
          <div className="space-y-2">
            <Label>How many guarantors?</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGuarantorCount(Math.max(0, guarantorCount - 1))}
                disabled={guarantorCount <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center w-16 h-10 rounded-md border bg-muted font-medium text-lg">
                {guarantorCount}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGuarantorCount(Math.min(10, guarantorCount + 1))}
                disabled={guarantorCount >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Personal guarantors for global DSCR</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={onNext} disabled={!canProceed}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Step 2: Name Entities & Guarantors
// ============================================

interface Step2Props {
  entities: EntityDraft[];
  setEntities: React.Dispatch<React.SetStateAction<EntityDraft[]>>;
  guarantors: GuarantorDraft[];
  setGuarantors: React.Dispatch<React.SetStateAction<GuarantorDraft[]>>;
  onBack: () => void;
  onNext: () => void;
}

function Step2({ entities, setEntities, guarantors, setGuarantors, onBack, onNext }: Step2Props) {
  const updateEntity = (id: string, updates: Partial<EntityDraft>) => {
    setEntities((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const updateGuarantor = (id: string, updates: Partial<GuarantorDraft>) => {
    setGuarantors((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const allEntitiesNamed = entities.every((e) => e.name.trim().length > 0);
  const allGuarantorsNamed = guarantors.every((g) => g.name.trim().length > 0);
  const canProceed = allEntitiesNamed && allGuarantorsNamed;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Entities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Borrowing Entities
          </CardTitle>
          <CardDescription>Name each entity and select its type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {entities.map((entity, index) => (
            <div key={entity.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                {index + 1}
              </div>
              <div className="flex-1 grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Entity name"
                  value={entity.name}
                  onChange={(e) => updateEntity(entity.id, { name: e.target.value })}
                />
                <Select
                  value={entity.type}
                  onValueChange={(value: EntityType) => updateEntity(entity.id, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operating">Operating Company</SelectItem>
                    <SelectItem value="holding">Holding Company</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Guarantors */}
      {guarantors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guarantors
            </CardTitle>
            <CardDescription>Name each guarantor and their ownership percentage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {guarantors.map((guarantor, index) => (
              <div key={guarantor.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Guarantor name"
                    value={guarantor.name}
                    onChange={(e) => updateGuarantor(guarantor.id, { name: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Ownership %"
                      value={guarantor.ownershipPercent || ''}
                      onChange={(e) => updateGuarantor(guarantor.id, { ownershipPercent: Number(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">% ownership</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button size="lg" onClick={onNext} disabled={!canProceed}>
          Continue to Upload
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Drop Zone Component
// ============================================

interface DropZoneProps {
  label: string;
  description: string;
  fileType: FileType;
  files: UploadedFile[];
  onDrop: (file: File) => void;
  onRemove: (fileId: string) => void;
  onDemo: () => void;
  optional?: boolean;
}

function DropZone({ label, description, files, onDrop, onRemove, onDemo, optional }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles[0]) {
      onDrop(droppedFiles[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onDrop(selectedFile);
    }
    e.target.value = '';
  };

  const hasCompleteFile = files.some((f) => f.status === 'complete');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label}
          {optional && <span className="text-muted-foreground font-normal ml-1">(optional)</span>}
        </Label>
        {!hasCompleteFile && (
          <Button variant="ghost" size="sm" onClick={onDemo} className="text-xs h-7">
            + Demo file
          </Button>
        )}
      </div>

      {files.length === 0 ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`
            relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all
            ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          `}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className={`h-6 w-6 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="mt-2 text-sm font-medium">{isDragging ? 'Drop here' : 'Drop file or click'}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                file.status === 'complete' ? 'bg-green-50 border-green-200 dark:bg-green-950/20' : ''
              }`}
            >
              <FileSpreadsheet className="h-5 w-5 text-green-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                {file.status === 'complete' ? (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Ready · {file.stats?.sheets} sheets · {file.stats?.rows} rows
                  </p>
                ) : (
                  <div className="mt-1">
                    <Progress value={file.progress} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {file.status === 'uploading' ? 'Uploading' : 'Parsing'}... {Math.round(file.progress)}%
                    </p>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => onRemove(file.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// Step 3: Upload Files
// ============================================

interface Step3Props {
  groupName: string;
  entities: EntityDraft[];
  setEntities: React.Dispatch<React.SetStateAction<EntityDraft[]>>;
  guarantors: GuarantorDraft[];
  setGuarantors: React.Dispatch<React.SetStateAction<GuarantorDraft[]>>;
  onBack: () => void;
  onComplete: () => void;
}

function Step3({ groupName, entities, setEntities, guarantors, setGuarantors, onBack, onComplete }: Step3Props) {
  const simulateUpload = useCallback(
    (
      targetId: string,
      targetType: 'entity' | 'guarantor',
      file: File,
      fileType: FileType
    ) => {
      const newFile: UploadedFile = {
        id: generateId(),
        name: file.name,
        size: file.size,
        fileType,
        status: 'uploading',
        progress: 0,
      };

      // Add file to target
      if (targetType === 'entity') {
        setEntities((prev) =>
          prev.map((e) => (e.id === targetId ? { ...e, files: [...e.files, newFile] } : e))
        );
      } else {
        setGuarantors((prev) =>
          prev.map((g) => (g.id === targetId ? { ...g, files: [...g.files, newFile] } : g))
        );
      }

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Mark complete with stats
          const updateFn = (items: (EntityDraft | GuarantorDraft)[]) =>
            items.map((item) =>
              item.id === targetId
                ? {
                    ...item,
                    files: item.files.map((f) =>
                      f.id === newFile.id
                        ? {
                            ...f,
                            status: 'complete' as FileStatus,
                            progress: 100,
                            stats: { sheets: Math.floor(Math.random() * 3) + 2, rows: Math.floor(Math.random() * 100) + 50 },
                          }
                        : f
                    ),
                  }
                : item
            );

          if (targetType === 'entity') {
            setEntities((prev) => updateFn(prev) as EntityDraft[]);
          } else {
            setGuarantors((prev) => updateFn(prev) as GuarantorDraft[]);
          }
        } else {
          const updateProgress = (items: (EntityDraft | GuarantorDraft)[]) =>
            items.map((item) =>
              item.id === targetId
                ? {
                    ...item,
                    files: item.files.map((f) =>
                      f.id === newFile.id ? { ...f, progress, status: progress > 50 ? 'parsing' as FileStatus : 'uploading' as FileStatus } : f
                    ),
                  }
                : item
            );

          if (targetType === 'entity') {
            setEntities((prev) => updateProgress(prev) as EntityDraft[]);
          } else {
            setGuarantors((prev) => updateProgress(prev) as GuarantorDraft[]);
          }
        }
      }, 150);
    },
    [setEntities, setGuarantors]
  );

  const removeFile = (targetId: string, targetType: 'entity' | 'guarantor', fileId: string) => {
    if (targetType === 'entity') {
      setEntities((prev) =>
        prev.map((e) => (e.id === targetId ? { ...e, files: e.files.filter((f) => f.id !== fileId) } : e))
      );
    } else {
      setGuarantors((prev) =>
        prev.map((g) => (g.id === targetId ? { ...g, files: g.files.filter((f) => f.id !== fileId) } : g))
      );
    }
  };

  const addDemoFile = (targetId: string, targetType: 'entity' | 'guarantor', fileType: FileType, name: string) => {
    const fakeFile = new globalThis.File([''], name, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    Object.defineProperty(fakeFile, 'size', { value: Math.floor(Math.random() * 300000) + 50000 });
    simulateUpload(targetId, targetType, fakeFile, fileType);
  };

  // Check if all required files are uploaded
  const allEntitiesHaveFiles = entities.every((e) => e.files.some((f) => f.status === 'complete' && f.fileType === 'spreads'));
  const allGuarantorsHaveFiles = guarantors.length === 0 || guarantors.every((g) => g.files.some((f) => f.status === 'complete'));
  const isProcessing = [...entities, ...guarantors].some((item) => item.files.some((f) => f.status !== 'complete' && f.status !== 'error'));
  const canProceed = allEntitiesHaveFiles && allGuarantorsHaveFiles && !isProcessing;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Sageworks Files</CardTitle>
          <CardDescription>
            Upload Sageworks Excel exports for each entity and guarantor in <strong>{groupName}</strong>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Entity Upload Zones */}
      {entities.map((entity) => (
        <Card key={entity.id}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              {entity.name}
              <Badge variant="outline" className="ml-2 font-normal">
                {entityTypeLabels[entity.type]}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Spreads Upload */}
              <DropZone
                label="Spreads"
                description="Balance Sheet & Income Statement"
                fileType="spreads"
                files={entity.files.filter((f) => f.fileType === 'spreads')}
                onDrop={(file) => simulateUpload(entity.id, 'entity', file, 'spreads')}
                onRemove={(fileId) => removeFile(entity.id, 'entity', fileId)}
                onDemo={() => addDemoFile(entity.id, 'entity', 'spreads', `${entity.name.replace(/\s+/g, '_')}_Spreads_2023.xlsx`)}
              />
              {/* UCA Upload */}
              <DropZone
                label="UCA"
                description="Uniform Cash Analysis"
                fileType="uca"
                files={entity.files.filter((f) => f.fileType === 'uca')}
                onDrop={(file) => simulateUpload(entity.id, 'entity', file, 'uca')}
                onRemove={(fileId) => removeFile(entity.id, 'entity', fileId)}
                onDemo={() => addDemoFile(entity.id, 'entity', 'uca', `${entity.name.replace(/\s+/g, '_')}_UCA_2023.xlsx`)}
                optional
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Guarantor Upload Zones */}
      {guarantors.map((guarantor) => (
        <Card key={guarantor.id}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              {guarantor.name}
              <Badge variant="outline" className="ml-2 font-normal">
                Guarantor · {guarantor.ownershipPercent}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DropZone
              label="Personal Financial Statement (PFS)"
              description="Personal Spreads from Sageworks"
              fileType="pfs"
              files={guarantor.files}
              onDrop={(file) => simulateUpload(guarantor.id, 'guarantor', file, 'pfs')}
              onRemove={(fileId) => removeFile(guarantor.id, 'guarantor', fileId)}
              onDemo={() => addDemoFile(guarantor.id, 'guarantor', 'pfs', `${guarantor.name.replace(/\s+/g, '_')}_PFS_2023.xlsx`)}
            />
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between pt-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button size="lg" onClick={onComplete} disabled={!canProceed}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue to Data Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function NewAnalysisPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [groupName, setGroupName] = useState('');
  const [entityCount, setEntityCount] = useState(1);
  const [guarantorCount, setGuarantorCount] = useState(0);

  // Step 2 & 3 state
  const [entities, setEntities] = useState<EntityDraft[]>([]);
  const [guarantors, setGuarantors] = useState<GuarantorDraft[]>([]);

  const handleStep1Next = () => {
    // Initialize entities and guarantors based on counts
    const newEntities: EntityDraft[] = Array.from({ length: entityCount }, () => ({
      id: generateId(),
      name: '',
      type: 'operating' as EntityType,
      files: [],
    }));
    const newGuarantors: GuarantorDraft[] = Array.from({ length: guarantorCount }, () => ({
      id: generateId(),
      name: '',
      ownershipPercent: 100,
      files: [],
    }));
    setEntities(newEntities);
    setGuarantors(newGuarantors);
    setStep(2);
  };

  const handleComplete = () => {
    router.push('/dashboard/analysis/demo/review');
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="New Analysis"
        subtitle={
          step === 1
            ? 'Define borrower relationship'
            : step === 2
            ? 'Name entities and guarantors'
            : 'Upload Sageworks files'
        }
      />

      {/* Progress indicator */}
      <div className="border-b px-6 py-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  s < step
                    ? 'bg-primary text-primary-foreground'
                    : s === step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 rounded ${s < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
          <span className="ml-4 text-sm text-muted-foreground">
            {step === 1 && 'Setup'}
            {step === 2 && 'Details'}
            {step === 3 && 'Upload'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 1 && (
          <Step1
            groupName={groupName}
            setGroupName={setGroupName}
            entityCount={entityCount}
            setEntityCount={setEntityCount}
            guarantorCount={guarantorCount}
            setGuarantorCount={setGuarantorCount}
            onNext={handleStep1Next}
          />
        )}
        {step === 2 && (
          <Step2
            entities={entities}
            setEntities={setEntities}
            guarantors={guarantors}
            setGuarantors={setGuarantors}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3
            groupName={groupName}
            entities={entities}
            setEntities={setEntities}
            guarantors={guarantors}
            setGuarantors={setGuarantors}
            onBack={() => setStep(2)}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
