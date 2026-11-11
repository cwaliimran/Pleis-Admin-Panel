'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EditorState, getDefaultKeyBinding, KeyBindingUtil, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { FileText, History, Receipt, ScrollText, ShieldCheck, SlidersHorizontal, Upload, Users } from 'lucide-react';

import { AppLoading } from '@/components/atoms/app-loading';
import ButtonLoading from '@/components/common/button-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  LegalDocument,
  LegalDocumentType,
  useGetAdminLegalDocumentsQuery,
  useGetLegalDocumentHistoryQuery,
  usePublishLegalDocumentMutation,
} from '@/store/Reducer/legal';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';

import ComplianceSettings from './ComplianceSettings';
import ConsentLogTable from './ConsentLogTable';
import { editorStyles } from './constants';
import { RichTextEditor } from './RichTextEditor';

/**
 * Legal documents are versioned: every publish creates a new immutable version, so each
 * consent record points at the exact text that was accepted. "Require re-acceptance"
 * prompts users / partners to accept again on their next login.
 */
const DOCS: { type: LegalDocumentType; title: string; short: string; audience: string; icon: React.ReactNode }[] = [
  { type: 'partner_terms', title: 'Partner Terms and Conditions', short: 'Partner T&C', audience: 'Partners — accepted at partner registration', icon: <Users className="h-4 w-4" /> },
  { type: 'terms_of_use', title: 'Terms of Use', short: 'Terms of Use', audience: 'Buyers — accepted at app registration', icon: <FileText className="h-4 w-4" /> },
  { type: 'sales_terms', title: 'Sales Terms', short: 'Sales Terms', audience: 'Buyers — shown in App → Settings → Legal', icon: <Receipt className="h-4 w-4" /> },
  { type: 'privacy_policy', title: 'Privacy Policy', short: 'Privacy', audience: 'Buyers + partners — accepted at registration', icon: <ShieldCheck className="h-4 w-4" /> },
];

const htmlToEditor = (html: string): EditorState => {
  if (!html) return EditorState.createEmpty();
  const contentState = stateFromHTML(html, {
    customBlockFn: (element) => {
      if (element.tagName === 'LI' && element.parentElement) {
        const depth = Array.from(element.parentElement.querySelectorAll('ul, ol')).length - 1;
        if (element.parentElement.tagName === 'UL') return { type: 'unordered-list-item', depth };
        if (element.parentElement.tagName === 'OL') return { type: 'ordered-list-item', depth };
      }
      return undefined;
    },
  });
  return EditorState.createWithContent(contentState);
};

const editorToHtml = (editorState: EditorState): string =>
  stateToHTML(editorState.getCurrentContent(), {
    blockStyleFn: (block: any) => {
      const blockType = block.getType();
      const depth = block.getDepth();
      if (blockType === 'unordered-list-item') return { element: 'li', nest: 'ul', attributes: { style: `margin-left: ${depth * 1.5}rem` } };
      if (blockType === 'ordered-list-item') return { element: 'li', nest: 'ol', attributes: { style: `margin-left: ${depth * 1.5}rem` } };
      return undefined;
    },
  } as any);

const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString('hr-HR') : '—');
const today = () => new Date().toISOString().slice(0, 10);

function DocumentEditor({ doc, meta }: { doc?: LegalDocument; meta: (typeof DOCS)[number] }) {
  const [editorState, setEditorState] = useState(() => htmlToEditor(doc?.content || ''));
  const [baseline, setBaseline] = useState(doc?.content || '');
  const [summary, setSummary] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(today());
  const [requiresReacceptance, setRequiresReacceptance] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [publish, { isLoading: isPublishing }] = usePublishLegalDocumentMutation();
  const { data: historyData, isFetching: historyLoading } = useGetLegalDocumentHistoryQuery(meta.type, { skip: !showHistory });

  // Reload the editor when a newer version arrives from the server.
  useEffect(() => {
    setEditorState(htmlToEditor(doc?.content || ''));
    setBaseline(doc?.content || '');
  }, [doc?._id, doc?.content]);

  const html = useMemo(() => editorToHtml(editorState), [editorState]);
  const hasChanges = html !== baseline && editorState.getCurrentContent().hasText();

  const handleKeyCommand = useCallback((command: string, state: EditorState) => {
    const next = RichUtils.handleKeyCommand(state, command);
    if (next) {
      setEditorState(next);
      return 'handled' as const;
    }
    return 'not-handled' as const;
  }, []);

  const keyBindingFn = useCallback((e: React.KeyboardEvent) => {
    if (KeyBindingUtil.hasCommandModifier(e)) {
      if (e.keyCode === 49) return 'header-one';
      if (e.keyCode === 50) return 'header-two';
      if (e.keyCode === 51) return 'header-three';
    }
    return getDefaultKeyBinding(e);
  }, []);

  const handlePublish = async () => {
    if (requiresReacceptance && !summary.trim()) {
      showError('Add a short summary of changes — it is shown to users when they are asked to accept again.');
      return;
    }
    try {
      const res = await publish({
        type: meta.type,
        content: html,
        summary: summary.trim(),
        effectiveDate,
        requiresReacceptance,
      }).unwrap();
      showSuccess(`${meta.title} v${res.data.version} published${requiresReacceptance ? ' — users will be asked to accept it on next login' : ''}`);
      setSummary('');
      setBaseline(html);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{meta.title}</h3>
          <p className="text-muted-foreground text-sm">{meta.audience}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {doc && (
            <Badge variant="secondary">
              Current: v{doc.version} · effective {formatDate(doc.effectiveDate)}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowHistory((s) => !s)} className="flex items-center gap-2">
            <History className="h-4 w-4" /> {showHistory ? 'Hide history' : 'Version history'}
          </Button>
        </div>
      </div>

      {showHistory && (
        <div className="rounded-md border p-3 text-sm dark:border-gray-700">
          {historyLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <ul className="divide-y dark:divide-gray-700">
              {(historyData?.data || []).map((v) => (
                <li key={v._id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="font-medium">v{v.version}</span>
                  <span className="text-muted-foreground flex-1 px-2">{v.summary || '—'}</span>
                  <span className="text-muted-foreground">
                    effective {formatDate(v.effectiveDate)} · published {formatDate(v.publishedAt)}
                  </span>
                  <Badge variant={v.requiresReacceptance ? 'default' : 'outline'}>{v.requiresReacceptance ? 'Re-acceptance' : 'Editorial'}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <RichTextEditor
        editorState={editorState}
        onEditorChange={setEditorState}
        onKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        placeholder={`Enter the ${meta.title} here...`}
        onToggleInlineStyle={(style) => setEditorState((s) => RichUtils.toggleInlineStyle(s, style))}
        onToggleBlockType={(blockType) => setEditorState((s) => RichUtils.toggleBlockType(s, blockType))}
        isInlineStyleActive={(style) => editorState.getCurrentInlineStyle().has(style)}
        isBlockTypeActive={(blockType) => {
          const key = editorState.getSelection().getStartKey();
          return editorState.getCurrentContent().getBlockForKey(key)?.getType() === blockType;
        }}
      />

      <div className="grid gap-4 rounded-md border p-4 md:grid-cols-[1fr_200px] dark:border-gray-700">
        <div className="space-y-2">
          <Label htmlFor={`summary-${meta.type}`}>Summary of changes</Label>
          <Textarea
            id={`summary-${meta.type}`}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Shown to users / partners when they are asked to accept the new version"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`effective-${meta.type}`}>Effective date</Label>
          <Input id={`effective-${meta.type}`} type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
        </div>
        <div className="flex items-start gap-2 md:col-span-2">
          <Checkbox
            id={`reaccept-${meta.type}`}
            checked={requiresReacceptance}
            onCheckedChange={(v) => setRequiresReacceptance(v === true)}
            className="mt-0.5 cursor-pointer"
          />
          <Label htmlFor={`reaccept-${meta.type}`} className="cursor-pointer leading-snug font-normal">
            Require acceptance of this version (users / partners must accept it again on next login).
            <span className="text-muted-foreground block text-xs">Untick only for editorial fixes (typos, formatting) — a new version is still recorded.</span>
          </Label>
        </div>
        <div className="flex justify-end md:col-span-2">
          {isPublishing ? (
            <Button size="sm" disabled>
              <ButtonLoading title="Publishing" />
            </Button>
          ) : (
            <Button size="sm" onClick={handlePublish} disabled={!hasChanges} className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Publish new version
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TermsView() {
  const { data, isLoading } = useGetAdminLegalDocumentsQuery();
  const [activeTab, setActiveTab] = useState<string>('partner_terms');
  const byType = useMemo(() => Object.fromEntries((data?.data || []).map((d) => [d.type, d])), [data]);

  if (isLoading) return <AppLoading />;

  return (
    <div className="container mx-auto w-full p-6">
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      <Card className="dark:bg-secondary w-full">
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl">Legal Documents</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:h-12 md:grid-cols-6">
              {DOCS.map((d) => (
                <TabsTrigger key={d.type} value={d.type} className="flex cursor-pointer items-center gap-2">
                  {d.icon}
                  <span>{d.short}</span>
                </TabsTrigger>
              ))}
              <TabsTrigger value="consent_log" className="flex cursor-pointer items-center gap-2">
                <ScrollText className="h-4 w-4" />
                <span>Consent log</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex cursor-pointer items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Compliance</span>
              </TabsTrigger>
            </TabsList>

            {DOCS.map((d) => (
              <TabsContent key={d.type} value={d.type} className="mt-4">
                <DocumentEditor doc={byType[d.type]} meta={d} />
              </TabsContent>
            ))}
            <TabsContent value="consent_log" className="mt-4">
              <ConsentLogTable />
            </TabsContent>
            <TabsContent value="compliance" className="mt-4">
              <ComplianceSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
