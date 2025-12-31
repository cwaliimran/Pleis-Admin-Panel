'use client';

import React from 'react';
import { Editor } from 'draft-js';
import { EditorToolbar } from './EditorToolbar';
import { RichTextEditorProps } from './types';

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  editorState,
  onEditorChange,
  onKeyCommand,
  keyBindingFn,
  placeholder,
  onToggleInlineStyle,
  onToggleBlockType,
  isInlineStyleActive,
  isBlockTypeActive,
}) => {
  return (
    <div>
      <EditorToolbar
        onToggleBlockType={onToggleBlockType}
        onToggleInlineStyle={onToggleInlineStyle}
        isBlockTypeActive={isBlockTypeActive}
        isInlineStyleActive={isInlineStyleActive}
      />

      <div className="min-h-[400px]">
        <Editor
          editorState={editorState}
          handleKeyCommand={onKeyCommand}
          keyBindingFn={keyBindingFn}
          onChange={onEditorChange}
          placeholder={placeholder}
          spellCheck={true}
        />
      </div>
    </div>
  );
};
