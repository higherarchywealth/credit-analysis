'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, RefreshCw, Edit2, Check, AlertTriangle } from 'lucide-react';
import { mockMemoSections } from '@/data';
import { MemoSection } from '@/types';

function MemoSectionCard({
  section,
  onEdit,
}: {
  section: MemoSection;
  onEdit: (id: string, content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(section.content);

  const handleSave = () => {
    onEdit(section.id, content);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{section.title}</CardTitle>
            {section.isGenerated && !section.isEdited && (
              <Badge variant="outline" className="text-xs">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Draft - Review Required
              </Badge>
            )}
            {section.isEdited && (
              <Badge variant="secondary" className="text-xs">
                <Check className="mr-1 h-3 w-3" />
                Reviewed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {section.content.split('\n').map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MemoPage({ params }: { params: { id: string } }) {
  const [sections, setSections] = useState(mockMemoSections);

  const handleEditSection = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content, isEdited: true } : s))
    );
  };

  const reviewedCount = sections.filter((s) => s.isEdited).length;
  const totalCount = sections.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">Credit Memo & Commentary</h1>
          <p className="text-sm text-muted-foreground">
            Review and edit auto-generated memo sections
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {reviewedCount} of {totalCount} sections reviewed
          </div>
          <Link href={`/dashboard/analysis/${params.id}/output`}>
            <Button>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Warning Banner */}
          <Card className="border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="text-sm">
                <span className="font-medium">Draft Commentary: </span>
                <span className="text-muted-foreground">
                  All sections below are auto-generated drafts. Please review each section and make
                  edits as needed before generating the final memo.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Memo Sections */}
          {sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <MemoSectionCard
                key={section.id}
                section={section}
                onEdit={handleEditSection}
              />
            ))}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate All
            </Button>
            <Button>
              <Check className="mr-2 h-4 w-4" />
              Mark All Reviewed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
