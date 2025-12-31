// 'use client';

// import { AppLoading } from '@/components/atoms/app-loading';
// import ButtonLoading from '@/components/common/button-loading';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useGetTermsAndConditionQuery, useUpdateTermMutation } from '@/store/Reducer/settings';
// import { getErrorMessage } from '@/utils/api';
// import { showError, showSuccess } from '@/utils/toast';
// import { Editor, EditorState, getDefaultKeyBinding, KeyBindingUtil, RichUtils } from 'draft-js';
// import { stateToHTML } from 'draft-js-export-html';
// import { stateFromHTML } from 'draft-js-import-html';
// import { Bold, FileText, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Save, ShieldCheck, Users } from 'lucide-react';
// import React, { useCallback, useEffect, useState } from 'react';

// const editorStyles = `
//   .DraftEditor-root {
//     border: 1px solid #e2e8f0;
//     border-radius: 0.375rem;
//     padding: 0.75rem;
//     min-height: 400px;
//     font-family: inherit;
//     font-size: 0.875rem;
//     line-height: 1.25rem;
//     background-color: var(--editor-bg, #ffffff);
//     color: var(--editor-text, #000000);
//   }

//   @media (prefers-color-scheme: dark) {
//     .DraftEditor-root {
//       border-color: #4b5563;
//       background-color: var(--editor-bg, #1f2937);
//       color: var(--editor-text, #e5e7eb);
//     }
//   }

//   .DraftEditor-root:focus-within {
//     outline: 2px solid #3b82f6;
//     outline-offset: 2px;
//     border-color: #3b82f6;
//   }

//   .public-DraftEditor-content {
//     min-height: 360px;
//   }

//   .public-DraftEditor-content h1 {
//     font-size: 2rem;
//     font-weight: 700;
//     margin: 1rem 0;
//     line-height: 1.2;
//   }

//   .public-DraftEditor-content h2 {
//     font-size: 1.5rem;
//     font-weight: 600;
//     margin: 0.875rem 0;
//     line-height: 1.3;
//   }

//   .public-DraftEditor-content h3 {
//     font-size: 1.25rem;
//     font-weight: 500;
//     margin: 0.75rem 0;
//     line-height: 1.4;
//   }

//   .public-DraftEditor-content strong {
//     font-weight: 700;
//   }

//   .public-DraftEditor-content em {
//     font-style: italic;
//   }

//   .public-DraftEditor-content ul {
//     margin: 1rem 0;
//     padding-left: 1.5rem;
//     list-style-type: disc !important;
//   }

//   .public-DraftEditor-content ol {
//     margin: 1rem 0;
//     padding-left: 1.5rem;
//     list-style-type: decimal !important;
//   }

//   .public-DraftEditor-content li {
//     margin: 0.25rem 0;
//     list-style: inherit !important;
//   }

//   .public-DraftEditor-content ul ul,
//   .public-DraftEditor-content ol ol,
//   .public-DraftEditor-content ul ol,
//   .public-DraftEditor-content ol ul {
//     margin-left: 1.5rem;
//   }
// `;

// interface ToolbarButtonProps {
//   onToggle: () => void;
//   active: boolean;
//   icon: React.ReactNode;
//   title: string;
// }

// const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onToggle, active, icon, title }) => (
//   <Button
//     variant={active ? 'default' : 'outline'}
//     size="sm"
//     onClick={onToggle}
//     title={title}
//     className={`dark:hover:bg-secondary h-8 w-8 p-0 dark:bg-[#313131] ${active ? 'bg-blue-700 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600' : ''}`}
//     type="button"
//   >
//     {icon}
//   </Button>
// );

// type DocumentType = 'organizer_terms' | 'customer_terms' | 'privacy_policy';

// interface EditorStateMap {
//   organizer_terms: EditorState;
//   customer_terms: EditorState;
//   privacy_policy: EditorState;
// }

// interface InitialContentMap {
//   organizer_terms: string | null;
//   customer_terms: string | null;
//   privacy_policy: string | null;
// }

// interface HasChangesMap {
//   organizer_terms: boolean;
//   customer_terms: boolean;
//   privacy_policy: boolean;
// }

// export default function TermsView() {
//   const { data: apiData, isLoading } = useGetTermsAndConditionQuery({});
//   const [updateTerms, { isLoading: updateTermsLoading }] = useUpdateTermMutation();

//   const [activeTab, setActiveTab] = useState<DocumentType>('organizer_terms');
//   const [isInitialized, setIsInitialized] = useState(false);

//   // Separate editor states for each document type
//   const [editorStates, setEditorStates] = useState<EditorStateMap>({
//     organizer_terms: EditorState.createEmpty(),
//     customer_terms: EditorState.createEmpty(),
//     privacy_policy: EditorState.createEmpty(),
//   });

//   const [initialContents, setInitialContents] = useState<InitialContentMap>({
//     organizer_terms: null,
//     customer_terms: null,
//     privacy_policy: null,
//   });

//   const [hasChanges, setHasChanges] = useState<HasChangesMap>({
//     organizer_terms: false,
//     customer_terms: false,
//     privacy_policy: false,
//   });

//   // Initialize editor content from API
//   useEffect(() => {
//     if (apiData?.data?.terms_and_conditions && !isInitialized) {
//       const htmlContent = apiData.data.terms_and_conditions;

//       const contentState = stateFromHTML(htmlContent, {
//         customBlockFn: (element) => {
//           if (element.tagName === 'LI' && element.parentElement) {
//             const depth = Array.from(element.parentElement.querySelectorAll('ul, ol')).length - 1;
//             if (element.parentElement.tagName === 'UL') {
//               return { type: 'unordered-list-item', depth };
//             }
//             if (element.parentElement.tagName === 'OL') {
//               return { type: 'ordered-list-item', depth };
//             }
//           }
//         },
//       });

//       // For now, initialize organizer_terms with the API data
//       // In the future, we'll load separate content for each type
//       setEditorStates({
//         organizer_terms: EditorState.createWithContent(contentState),
//         customer_terms: EditorState.createEmpty(),
//         privacy_policy: EditorState.createEmpty(),
//       });

//       setInitialContents({
//         organizer_terms: htmlContent,
//         customer_terms: null,
//         privacy_policy: null,
//       });

//       setIsInitialized(true);
//     }
//   }, [apiData, isInitialized]);

//   const handleEditorChange = useCallback(
//     (newEditorState: EditorState, type: DocumentType) => {
//       setEditorStates((prev) => ({
//         ...prev,
//         [type]: newEditorState,
//       }));

//       // Convert current content to HTML and compare with initial content
//       const currentContent = newEditorState.getCurrentContent();
//       const options = {
//         blockStyleFn: (block: any) => {
//           const blockType = block.getType();
//           const depth = block.getDepth();
//           if (blockType === 'unordered-list-item') {
//             return {
//               element: 'li',
//               nest: 'ul',
//               attributes: { style: `margin-left: ${depth * 1.5}rem` },
//             };
//           }
//           if (blockType === 'ordered-list-item') {
//             return {
//               element: 'li',
//               nest: 'ol',
//               attributes: { style: `margin-left: ${depth * 1.5}rem` },
//             };
//           }
//         },
//       };
//       const currentHtml = stateToHTML(currentContent, options);

//       setHasChanges((prev) => ({
//         ...prev,
//         [type]: currentHtml !== initialContents[type],
//       }));
//     },
//     [initialContents]
//   );

//   const handleKeyCommand = useCallback((command: string, editorState: EditorState, type: DocumentType) => {
//     const newState = RichUtils.handleKeyCommand(editorState, command);
//     if (newState) {
//       setEditorStates((prev) => ({
//         ...prev,
//         [type]: newState,
//       }));
//       return 'handled';
//     }
//     return 'not-handled';
//   }, []);

//   const keyBindingFn = useCallback((e: React.KeyboardEvent) => {
//     if (KeyBindingUtil.hasCommandModifier(e)) {
//       switch (e.keyCode) {
//         case 49:
//           return 'header-one';
//         case 50:
//           return 'header-two';
//         case 51:
//           return 'header-three';
//         default:
//           return getDefaultKeyBinding(e);
//       }
//     }
//     return getDefaultKeyBinding(e);
//   }, []);

//   const toggleInlineStyle = useCallback((style: string, type: DocumentType) => {
//     setEditorStates((prev) => ({
//       ...prev,
//       [type]: RichUtils.toggleInlineStyle(prev[type], style),
//     }));
//   }, []);

//   const toggleBlockType = useCallback((blockType: string, type: DocumentType) => {
//     setEditorStates((prev) => ({
//       ...prev,
//       [type]: RichUtils.toggleBlockType(prev[type], blockType),
//     }));
//   }, []);

//   const isInlineStyleActive = useCallback(
//     (style: string, type: DocumentType): boolean => {
//       const currentStyle = editorStates[type].getCurrentInlineStyle();
//       return currentStyle.has(style);
//     },
//     [editorStates]
//   );

//   const isBlockTypeActive = useCallback(
//     (blockType: string, type: DocumentType): boolean => {
//       const editorState = editorStates[type];
//       const selection = editorState.getSelection();
//       const blockKey = selection.getStartKey();
//       const currentBlock = editorState.getCurrentContent().getBlockForKey(blockKey);
//       return currentBlock.getType() === blockType;
//     },
//     [editorStates]
//   );

//   const handleSave = async (type: DocumentType) => {
//     const contentState = editorStates[type].getCurrentContent();
//     const options = {
//       blockStyleFn: (block: any) => {
//         const blockType = block.getType();
//         const depth = block.getDepth();
//         if (blockType === 'unordered-list-item') {
//           return {
//             element: 'li',
//             nest: 'ul',
//             attributes: { style: `margin-left: ${depth * 1.5}rem` },
//           };
//         }
//         if (blockType === 'ordered-list-item') {
//           return {
//             element: 'li',
//             nest: 'ol',
//             attributes: { style: `margin-left: ${depth * 1.5}rem` },
//           };
//         }
//       },
//     };
//     const html = stateToHTML(contentState, options);

//     try {
//       const payload = {
//         id: apiData?.data?._id || '',
//         terms_and_conditions: html,
//         // In the future, you can add type parameter here
//         // type: type,
//       };

//       const response = await updateTerms(payload).unwrap();

//       if (!response) {
//         showError('No response from server. Please try again later.');
//         return;
//       }

//       if (response.error) {
//         const errorMessage = getErrorMessage(response.error);
//         showError(errorMessage);
//         return;
//       }

//       if (response?.message) {
//         const documentNames = {
//           organizer_terms: 'Organizer Terms & Conditions',
//           customer_terms: 'Customer Terms & Conditions',
//           privacy_policy: 'Privacy Policy',
//         };

//         showSuccess(response.message || `${documentNames[type]} updated successfully`);

//         // Update initial content after successful save
//         setInitialContents((prev) => ({
//           ...prev,
//           [type]: html,
//         }));

//         setHasChanges((prev) => ({
//           ...prev,
//           [type]: false,
//         }));
//       }
//     } catch (error) {
//       const errorMessage = getErrorMessage(error);
//       showError(errorMessage);
//     }
//   };

//   const renderEditor = (type: DocumentType) => {
//     const currentEditorState = editorStates[type];

//     return (
//       <div>
//         {/* Toolbar */}
//         <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
//           <div className="flex flex-wrap gap-2">
//             <div className="flex gap-1">
//               <ToolbarButton
//                 onToggle={() => toggleBlockType('header-one', type)}
//                 active={isBlockTypeActive('header-one', type)}
//                 icon={<Heading1 className="h-4 w-4" />}
//                 title="Heading 1 (Cmd+1)"
//               />
//               <ToolbarButton
//                 onToggle={() => toggleBlockType('header-two', type)}
//                 active={isBlockTypeActive('header-two', type)}
//                 icon={<Heading2 className="h-4 w-4" />}
//                 title="Heading 2 (Cmd+2)"
//               />
//               <ToolbarButton
//                 onToggle={() => toggleBlockType('header-three', type)}
//                 active={isBlockTypeActive('header-three', type)}
//                 icon={<Heading3 className="h-4 w-4" />}
//                 title="Heading 3 (Cmd+3)"
//               />
//             </div>

//             <Separator orientation="vertical" className="h-8" />

//             <div className="flex gap-1">
//               <ToolbarButton
//                 onToggle={() => toggleInlineStyle('BOLD', type)}
//                 active={isInlineStyleActive('BOLD', type)}
//                 icon={<Bold className="h-4 w-4" />}
//                 title="Bold (Cmd+B)"
//               />
//               <ToolbarButton
//                 onToggle={() => toggleInlineStyle('ITALIC', type)}
//                 active={isInlineStyleActive('ITALIC', type)}
//                 icon={<Italic className="h-4 w-4" />}
//                 title="Italic (Cmd+I)"
//               />
//             </div>

//             <Separator orientation="vertical" className="h-8" />

//             <div className="flex gap-1">
//               <ToolbarButton
//                 onToggle={() => toggleBlockType('unordered-list-item', type)}
//                 active={isBlockTypeActive('unordered-list-item', type)}
//                 icon={<List className="h-4 w-4" />}
//                 title="Bullet List"
//               />
//               <ToolbarButton
//                 onToggle={() => toggleBlockType('ordered-list-item', type)}
//                 active={isBlockTypeActive('ordered-list-item', type)}
//                 icon={<ListOrdered className="h-4 w-4" />}
//                 title="Numbered List"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Editor */}
//         <div className="min-h-[400px]">
//           <Editor
//             editorState={currentEditorState}
//             handleKeyCommand={(command, state) => handleKeyCommand(command, state, type)}
//             keyBindingFn={keyBindingFn}
//             onChange={(state) => handleEditorChange(state, type)}
//             placeholder={`Enter ${type === 'organizer_terms' ? 'organizer terms & conditions' : type === 'customer_terms' ? 'customer terms & conditions' : 'privacy policy'} here...`}
//             spellCheck={true}
//           />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       {isLoading ? (
//         <AppLoading />
//       ) : (
//         <div className="container mx-auto w-full p-6">
//           <style dangerouslySetInnerHTML={{ __html: editorStyles }} />

//           <Card className="dark:bg-secondary w-full">
//             <CardHeader>
//               <CardTitle>
//                 <h2 className="text-xl">Legal Documents</h2>
//               </CardTitle>
//             </CardHeader>

//             <CardContent>
//               <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DocumentType)} className="w-full">
//                 <TabsList className="grid h-12 w-full grid-cols-3">
//                   <TabsTrigger value="organizer_terms" className="flex cursor-pointer items-center gap-2">
//                     <Users className="h-4 w-4" />
//                     <span className="hidden sm:inline">Organizer Terms</span>
//                     <span className="sm:hidden">Organizer</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="customer_terms" className="flex cursor-pointer items-center gap-2">
//                     <FileText className="h-4 w-4" />
//                     <span className="hidden sm:inline">Customer Terms</span>
//                     <span className="sm:hidden">Customer</span>
//                   </TabsTrigger>
//                   <TabsTrigger value="privacy_policy" className="flex cursor-pointer items-center gap-2">
//                     <ShieldCheck className="h-4 w-4" />
//                     <span className="hidden sm:inline">Privacy Policy</span>
//                     <span className="sm:hidden">Privacy</span>
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Organizer Terms Tab */}
//                 <TabsContent value="organizer_terms" className="mt-3">
//                   <div className="mb-4 flex items-center justify-between">
//                     <h3 className="text-lg font-semibold">Terms & Conditions for Organizers</h3>
//                     <div className="flex gap-2">
//                       {updateTermsLoading ? (
//                         <Button size="sm" className="flex items-center gap-2" disabled>
//                           <ButtonLoading title="Saving" />
//                         </Button>
//                       ) : (
//                         <Button
//                           onClick={() => handleSave('organizer_terms')}
//                           size="sm"
//                           className="flex items-center gap-2"
//                           disabled={!hasChanges.organizer_terms}
//                         >
//                           <Save className="h-4 w-4" />
//                           Save
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                   {renderEditor('organizer_terms')}
//                 </TabsContent>

//                 {/* Customer Terms Tab */}
//                 <TabsContent value="customer_terms" className="mt-6">
//                   <div className="mb-4 flex items-center justify-between">
//                     <h3 className="text-lg font-semibold">Terms & Conditions for Customers</h3>
//                     <div className="flex gap-2">
//                       {updateTermsLoading ? (
//                         <Button size="sm" className="flex items-center gap-2" disabled>
//                           <ButtonLoading title="Saving" />
//                         </Button>
//                       ) : (
//                         <Button
//                           onClick={() => handleSave('customer_terms')}
//                           size="sm"
//                           className="flex items-center gap-2"
//                           disabled={!hasChanges.customer_terms}
//                         >
//                           <Save className="h-4 w-4" />
//                           Save
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                   {renderEditor('customer_terms')}
//                 </TabsContent>

//                 {/* Privacy Policy Tab */}
//                 <TabsContent value="privacy_policy" className="mt-6">
//                   <div className="mb-4 flex items-center justify-between">
//                     <h3 className="text-lg font-semibold">Privacy Policy</h3>
//                     <div className="flex gap-2">
//                       {updateTermsLoading ? (
//                         <Button size="sm" className="flex items-center gap-2" disabled>
//                           <ButtonLoading title="Saving" />
//                         </Button>
//                       ) : (
//                         <Button
//                           onClick={() => handleSave('privacy_policy')}
//                           size="sm"
//                           className="flex items-center gap-2"
//                           disabled={!hasChanges.privacy_policy}
//                         >
//                           <Save className="h-4 w-4" />
//                           Save
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                   {renderEditor('privacy_policy')}
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </>
//   );
// }
