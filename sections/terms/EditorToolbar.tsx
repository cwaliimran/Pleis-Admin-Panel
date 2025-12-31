'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered } from 'lucide-react';
import { ToolbarButtonProps } from './types';

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onToggle, active, icon, title }) => (
  <Button
    variant={active ? 'default' : 'outline'}
    size="sm"
    onClick={onToggle}
    title={title}
    className={`dark:hover:bg-secondary h-8 w-8 p-0 dark:bg-[#313131] ${
      active ? 'bg-blue-700 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600' : ''
    }`}
    type="button"
  >
    {icon}
  </Button>
);

interface EditorToolbarProps {
  onToggleBlockType: (blockType: string) => void;
  onToggleInlineStyle: (style: string) => void;
  isBlockTypeActive: (blockType: string) => boolean;
  isInlineStyleActive: (style: string) => boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onToggleBlockType, onToggleInlineStyle, isBlockTypeActive, isInlineStyleActive }) => {
  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          <ToolbarButton
            onToggle={() => onToggleBlockType('header-one')}
            active={isBlockTypeActive('header-one')}
            icon={<Heading1 className="h-4 w-4" />}
            title="Heading 1 (Cmd+1)"
          />
          <ToolbarButton
            onToggle={() => onToggleBlockType('header-two')}
            active={isBlockTypeActive('header-two')}
            icon={<Heading2 className="h-4 w-4" />}
            title="Heading 2 (Cmd+2)"
          />
          <ToolbarButton
            onToggle={() => onToggleBlockType('header-three')}
            active={isBlockTypeActive('header-three')}
            icon={<Heading3 className="h-4 w-4" />}
            title="Heading 3 (Cmd+3)"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex gap-1">
          <ToolbarButton
            onToggle={() => onToggleInlineStyle('BOLD')}
            active={isInlineStyleActive('BOLD')}
            icon={<Bold className="h-4 w-4" />}
            title="Bold (Cmd+B)"
          />
          <ToolbarButton
            onToggle={() => onToggleInlineStyle('ITALIC')}
            active={isInlineStyleActive('ITALIC')}
            icon={<Italic className="h-4 w-4" />}
            title="Italic (Cmd+I)"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex gap-1">
          <ToolbarButton
            onToggle={() => onToggleBlockType('unordered-list-item')}
            active={isBlockTypeActive('unordered-list-item')}
            icon={<List className="h-4 w-4" />}
            title="Bullet List"
          />
          <ToolbarButton
            onToggle={() => onToggleBlockType('ordered-list-item')}
            active={isBlockTypeActive('ordered-list-item')}
            icon={<ListOrdered className="h-4 w-4" />}
            title="Numbered List"
          />
        </div>
      </div>
    </div>
  );
};
