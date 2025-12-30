// components/terms/types.ts
import { EditorState } from 'draft-js';

export type DocumentType = 'organizer_terms' | 'customer_terms' | 'privacy_policy';

export interface EditorStateMap {
  organizer_terms: EditorState;
  customer_terms: EditorState;
  privacy_policy: EditorState;
}

export interface InitialContentMap {
  organizer_terms: string | null;
  customer_terms: string | null;
  privacy_policy: string | null;
}

export interface HasChangesMap {
  organizer_terms: boolean;
  customer_terms: boolean;
  privacy_policy: boolean;
}

export interface SettingsIdMap {
  organizer_terms: string | null;
  customer_terms: string | null;
  privacy_policy: string | null;
}

export interface ToolbarButtonProps {
  onToggle: () => void;
  active: boolean;
  icon: React.ReactNode;
  title: string;
}

export interface RichTextEditorProps {
  editorState: EditorState;
  onEditorChange: (state: EditorState) => void;
  onKeyCommand: (command: string, state: EditorState) => 'handled' | 'not-handled';
  keyBindingFn: (e: React.KeyboardEvent) => string | null;
  placeholder: string;
  onToggleInlineStyle: (style: string) => void;
  onToggleBlockType: (blockType: string) => void;
  isInlineStyleActive: (style: string) => boolean;
  isBlockTypeActive: (blockType: string) => boolean;
}

// API Response Types
export interface TermsApiResponse {
  message: string;
  data: {
    _id: string;
    terms_and_conditions?: string;
    customer_terms_and_conditions?: string;
    privacy_policy?: string;
  };
}

export interface CreateSettingsPayload {
  terms_and_conditions?: string;
  customer_terms_and_conditions?: string;
  privacy_policy?: string;
}

export interface UpdateSettingsPayload {
  id: string;
  terms_and_conditions?: string;
  customer_terms_and_conditions?: string;
  privacy_policy?: string;
}

export interface ApiErrorResponse {
  message: string;
  error?: any;
}
