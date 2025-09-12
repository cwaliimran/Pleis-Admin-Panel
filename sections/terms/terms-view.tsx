'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Save,
} from 'lucide-react';
import {
  useGetTermsAndConditionQuery,
  useUpdateTermMutation,
} from '@/store/Reducer/settings';
import { AppLoading } from '@/components/atoms/app-loading';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import ButtonLoading from '@/components/common/button-loading';

const editorStyles = `
  .DraftEditor-root {
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    padding: 0.75rem;
    min-height: 400px;
    font-family: inherit;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background-color: var(--editor-bg, #ffffff);
    color: var(--editor-text, #000000);
  }

  @media (prefers-color-scheme: dark) {
    .DraftEditor-root {
      border-color: #4b5563;
      background-color: var(--editor-bg, #1f2937);
      color: var(--editor-text, #e5e7eb);
    }
  }

  .DraftEditor-root:focus-within {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-color: #3b82f6;
  }

  .public-DraftEditor-content {
    min-height: 360px;
  }

  .public-DraftEditor-content h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 1rem 0;
    line-height: 1.2;
  }

  .public-DraftEditor-content h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.875rem 0;
    line-height: 1.3;
  }

  .public-DraftEditor-content h3 {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0.75rem 0;
    line-height: 1.4;
  }

  .public-DraftEditor-content strong {
    font-weight: 700;
  }

  .public-DraftEditor-content em {
    font-style: italic;
  }

  .public-DraftEditor-content ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
    list-style-type: disc !important;
  }

  .public-DraftEditor-content ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
    list-style-type: decimal !important;
  }

  .public-DraftEditor-content li {
    margin: 0.25rem 0;
    list-style: inherit !important;
  }

  .public-DraftEditor-content ul ul,
  .public-DraftEditor-content ol ol,
  .public-DraftEditor-content ul ol,
  .public-DraftEditor-content ol ul {
    margin-left: 1.5rem;
  }
`;

interface ToolbarButtonProps {
  onToggle: () => void;
  active: boolean;
  icon: React.ReactNode;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onToggle,
  active,
  icon,
  title,
}) => (
  <Button
    variant={active ? 'default' : 'outline'}
    size="sm"
    onClick={onToggle}
    title={title}
    className={`dark:hover:bg-secondary h-8 w-8 p-0 dark:bg-[#313131] ${active ? 'bg-blue-700 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600' : ''}`}
    type="button"
  >
    {icon}
  </Button>
);

export default function TermsView() {
  const { data: apiData, isLoading } = useGetTermsAndConditionQuery({});
  const [updateTerms, { isLoading: updateTermsLoading }] =
    useUpdateTermMutation();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (apiData?.data?.terms_and_conditions && !isInitialized) {
      const contentState = stateFromHTML(apiData.data.terms_and_conditions, {
        customBlockFn: (element) => {
          if (element.tagName === 'LI' && element.parentElement) {
            const depth =
              Array.from(element.parentElement.querySelectorAll('ul, ol'))
                .length - 1;
            if (element.parentElement.tagName === 'UL') {
              return { type: 'unordered-list-item', depth };
            }
            if (element.parentElement.tagName === 'OL') {
              return { type: 'ordered-list-item', depth };
            }
          }
        },
      });
      setEditorState(EditorState.createWithContent(contentState));
      setInitialContent(apiData.data.terms_and_conditions);
      setIsInitialized(true);
    }
  }, [apiData, isInitialized]);

  const handleEditorChange = useCallback(
    (newEditorState: EditorState) => {
      setEditorState(newEditorState);
      // const currentBlockType = newEditorState
      //   .getCurrentContent()
      //   .getBlockForKey(newEditorState.getSelection().getStartKey())
      //   .getType();

      // Convert current content to HTML and compare with initial content
      const currentContent = newEditorState.getCurrentContent();
      const options = {
        blockStyleFn: (block: any) => {
          const type = block.getType();
          const depth = block.getDepth();
          if (type === 'unordered-list-item') {
            return {
              element: 'li',
              nest: 'ul',
              attributes: { style: `margin-left: ${depth * 1.5}rem` },
            };
          }
          if (type === 'ordered-list-item') {
            return {
              element: 'li',
              nest: 'ol',
              attributes: { style: `margin-left: ${depth * 1.5}rem` },
            };
          }
        },
      };
      const currentHtml = stateToHTML(currentContent, options);
      setHasChanges(currentHtml !== initialContent);
    },
    [initialContent]
  );

  const handleKeyCommand = useCallback(
    (command: string, editorState: EditorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    },
    []
  );

  const keyBindingFn = useCallback((e: React.KeyboardEvent) => {
    if (KeyBindingUtil.hasCommandModifier(e)) {
      switch (e.keyCode) {
        case 49:
          return 'header-one';
        case 50:
          return 'header-two';
        case 51:
          return 'header-three';
        default:
          return getDefaultKeyBinding(e);
      }
    }
    return getDefaultKeyBinding(e);
  }, []);

  const toggleInlineStyle = useCallback(
    (style: string) => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    },
    [editorState]
  );

  const toggleBlockType = useCallback(
    (blockType: string) => {
      setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    },
    [editorState]
  );

  const isInlineStyleActive = useCallback(
    (style: string): boolean => {
      const currentStyle = editorState.getCurrentInlineStyle();
      return currentStyle.has(style);
    },
    [editorState]
  );

  const isBlockTypeActive = useCallback(
    (blockType: string): boolean => {
      const selection = editorState.getSelection();
      const blockKey = selection.getStartKey();
      const currentBlock = editorState
        .getCurrentContent()
        .getBlockForKey(blockKey);
      return currentBlock.getType() === blockType;
    },
    [editorState]
  );

  const handleSave = async () => {
    const contentState = editorState.getCurrentContent();
    const options = {
      blockStyleFn: (block: any) => {
        const type = block.getType();
        const depth = block.getDepth();
        if (type === 'unordered-list-item') {
          return {
            element: 'li',
            nest: 'ul',
            attributes: { style: `margin-left: ${depth * 1.5}rem` },
          };
        }
        if (type === 'ordered-list-item') {
          return {
            element: 'li',
            nest: 'ol',
            attributes: { style: `margin-left: ${depth * 1.5}rem` },
          };
        }
      },
    };
    const html = stateToHTML(contentState, options);

    try {
      const payload = {
        id: apiData?.data?._id || '',
        terms_and_conditions: html,
      };

      const response = await updateTerms(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (response?.message) {
        showSuccess(
          response.message || 'Terms & Conditions updated successfully'
        );
        // Update initial content after successful save
        setInitialContent(html);
        setHasChanges(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save terms:', errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <>
      {isLoading ? (
        <AppLoading />
      ) : (
        <div className="container mx-auto w-full p-6">
          <style dangerouslySetInnerHTML={{ __html: editorStyles }} />

          <Card className="dark:bg-secondary w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <h2 className="text-xl">Terms & Conditions</h2>
                <div className="flex gap-2">
                  {updateTermsLoading ? (
                    <Button size="sm" className="flex items-center gap-2" disabled>
                      <ButtonLoading title="Saving" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={!hasChanges}
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-1">
                    <ToolbarButton
                      onToggle={() => toggleBlockType('header-one')}
                      active={isBlockTypeActive('header-one')}
                      icon={<Heading1 className="h-4 w-4" />}
                      title="Heading 1 (Cmd+1)"
                    />
                    <ToolbarButton
                      onToggle={() => toggleBlockType('header-two')}
                      active={isBlockTypeActive('header-two')}
                      icon={<Heading2 className="h-4 w-4" />}
                      title="Heading 2 (Cmd+2)"
                    />
                    <ToolbarButton
                      onToggle={() => toggleBlockType('header-three')}
                      active={isBlockTypeActive('header-three')}
                      icon={<Heading3 className="h-4 w-4" />}
                      title="Heading 3 (Cmd+3)"
                    />
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex gap-1">
                    <ToolbarButton
                      onToggle={() => toggleInlineStyle('BOLD')}
                      active={isInlineStyleActive('BOLD')}
                      icon={<Bold className="h-4 w-4" />}
                      title="Bold (Cmd+B)"
                    />
                    <ToolbarButton
                      onToggle={() => toggleInlineStyle('ITALIC')}
                      active={isInlineStyleActive('ITALIC')}
                      icon={<Italic className="h-4 w-4" />}
                      title="Italic (Cmd+I)"
                    />
                  </div>

                  <Separator orientation="vertical" className="h-8" />

                  <div className="flex gap-1">
                    <ToolbarButton
                      onToggle={() => toggleBlockType('unordered-list-item')}
                      active={isBlockTypeActive('unordered-list-item')}
                      icon={<List className="h-4 w-4" />}
                      title="Bullet List"
                    />
                    <ToolbarButton
                      onToggle={() => toggleBlockType('ordered-list-item')}
                      active={isBlockTypeActive('ordered-list-item')}
                      icon={<ListOrdered className="h-4 w-4" />}
                      title="Numbered List"
                    />
                  </div>
                </div>
              </div>

              <div className="min-h-[400px]">
                <Editor
                  editorState={editorState}
                  handleKeyCommand={handleKeyCommand}
                  keyBindingFn={keyBindingFn}
                  onChange={handleEditorChange}
                  placeholder="Enter your terms and conditions here..."
                  spellCheck={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}