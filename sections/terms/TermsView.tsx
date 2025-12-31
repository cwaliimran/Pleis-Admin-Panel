'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { EditorState, getDefaultKeyBinding, KeyBindingUtil, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { FileText, Save, ShieldCheck, Users } from 'lucide-react';

import { AppLoading } from '@/components/atoms/app-loading';
import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetOrganizerTermsQuery,
  useGetCustomerTermsQuery,
  useGetPrivacyPolicyQuery,
  useCreateSettingsMutation,
  useUpdateSettingsMutation,
} from '@/store/Reducer/settings';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';

import { RichTextEditor } from './RichTextEditor';
import { DocumentType, EditorStateMap, InitialContentMap, HasChangesMap, SettingsIdMap } from './types';
import { DOCUMENT_TYPE_CONFIG, TERMS_NOT_FOUND_MESSAGE, PRIVACY_NOT_FOUND_MESSAGE, editorStyles } from './constants';

export default function TermsView() {
  // API Hooks
  const { data: organizerData, isLoading: isLoadingOrganizer, error: organizerError } = useGetOrganizerTermsQuery();
  const { data: customerData, isLoading: isLoadingCustomer, error: customerError } = useGetCustomerTermsQuery();
  const { data: privacyData, isLoading: isLoadingPrivacy, error: privacyError } = useGetPrivacyPolicyQuery();

  const [createSettings, { isLoading: isCreating }] = useCreateSettingsMutation();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  // State Management
  const [activeTab, setActiveTab] = useState<DocumentType>('organizer_terms');
  const [isInitialized, setIsInitialized] = useState({
    organizer_terms: false,
    customer_terms: false,
    privacy_policy: false,
  });

  const [editorStates, setEditorStates] = useState<EditorStateMap>({
    organizer_terms: EditorState.createEmpty(),
    customer_terms: EditorState.createEmpty(),
    privacy_policy: EditorState.createEmpty(),
  });

  const [initialContents, setInitialContents] = useState<InitialContentMap>({
    organizer_terms: null,
    customer_terms: null,
    privacy_policy: null,
  });

  const [hasChanges, setHasChanges] = useState<HasChangesMap>({
    organizer_terms: false,
    customer_terms: false,
    privacy_policy: false,
  });

  const [settingsIds, setSettingsIds] = useState<SettingsIdMap>({
    organizer_terms: null,
    customer_terms: null,
    privacy_policy: null,
  });

  // Helper function to convert HTML to EditorState
  const createEditorStateFromHTML = useCallback((html: string): EditorState => {
    const contentState = stateFromHTML(html, {
      customBlockFn: (element) => {
        if (element.tagName === 'LI' && element.parentElement) {
          const depth = Array.from(element.parentElement.querySelectorAll('ul, ol')).length - 1;
          if (element.parentElement.tagName === 'UL') {
            return { type: 'unordered-list-item', depth };
          }
          if (element.parentElement.tagName === 'OL') {
            return { type: 'ordered-list-item', depth };
          }
        }
        return undefined;
      },
    });
    return EditorState.createWithContent(contentState);
  }, []);

  // Helper function to convert EditorState to HTML
  const convertEditorStateToHTML = useCallback((editorState: EditorState): string => {
    const contentState = editorState.getCurrentContent();
    const options = {
      blockStyleFn: (block: any) => {
        const blockType = block.getType();
        const depth = block.getDepth();
        if (blockType === 'unordered-list-item') {
          return {
            element: 'li',
            nest: 'ul',
            attributes: { style: `margin-left: ${depth * 1.5}rem` },
          };
        }
        if (blockType === 'ordered-list-item') {
          return {
            element: 'li',
            nest: 'ol',
            attributes: { style: `margin-left: ${depth * 1.5}rem` },
          };
        }
        return undefined;
      },
    };
    return stateToHTML(contentState, options);
  }, []);

  // Initialize Organizer Terms
  useEffect(() => {
    if (organizerData?.data && !isInitialized.organizer_terms) {
      const content = organizerData.data.terms_and_conditions;
      const id = organizerData.data._id;

      if (content) {
        setEditorStates((prev) => ({
          ...prev,
          organizer_terms: createEditorStateFromHTML(content),
        }));
        setInitialContents((prev) => ({
          ...prev,
          organizer_terms: content,
        }));
      }

      if (id) {
        setSettingsIds((prev) => ({
          ...prev,
          organizer_terms: id,
        }));
      }

      setIsInitialized((prev) => ({ ...prev, organizer_terms: true }));
    }
  }, [organizerData, isInitialized.organizer_terms, createEditorStateFromHTML]);

  // Initialize Customer Terms
  useEffect(() => {
    if (customerData?.data && !isInitialized.customer_terms) {
      const content = customerData.data.customer_terms_and_conditions;
      const id = customerData.data._id;

      if (content) {
        setEditorStates((prev) => ({
          ...prev,
          customer_terms: createEditorStateFromHTML(content),
        }));
        setInitialContents((prev) => ({
          ...prev,
          customer_terms: content,
        }));
      }

      if (id) {
        setSettingsIds((prev) => ({
          ...prev,
          customer_terms: id,
        }));
      }

      setIsInitialized((prev) => ({ ...prev, customer_terms: true }));
    }
  }, [customerData, isInitialized.customer_terms, createEditorStateFromHTML]);

  // Initialize Privacy Policy
  useEffect(() => {
    if (privacyData?.data && !isInitialized.privacy_policy) {
      const content = privacyData.data.privacy_policy;
      const id = privacyData.data._id;

      if (content) {
        setEditorStates((prev) => ({
          ...prev,
          privacy_policy: createEditorStateFromHTML(content),
        }));
        setInitialContents((prev) => ({
          ...prev,
          privacy_policy: content,
        }));
      }

      if (id) {
        setSettingsIds((prev) => ({
          ...prev,
          privacy_policy: id,
        }));
      }

      setIsInitialized((prev) => ({ ...prev, privacy_policy: true }));
    }
  }, [privacyData, isInitialized.privacy_policy, createEditorStateFromHTML]);

  // Editor Change Handler
  const handleEditorChange = useCallback(
    (newEditorState: EditorState, type: DocumentType) => {
      setEditorStates((prev) => ({
        ...prev,
        [type]: newEditorState,
      }));

      const currentHtml = convertEditorStateToHTML(newEditorState);
      setHasChanges((prev) => ({
        ...prev,
        [type]: currentHtml !== initialContents[type],
      }));
    },
    [initialContents, convertEditorStateToHTML]
  );

  // Key Command Handler
  const handleKeyCommand = useCallback((command: string, editorState: EditorState, type: DocumentType) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorStates((prev) => ({
        ...prev,
        [type]: newState,
      }));
      return 'handled' as const;
    }
    return 'not-handled' as const;
  }, []);

  // Key Binding Function
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

  // Toggle Inline Style
  const toggleInlineStyle = useCallback((style: string, type: DocumentType) => {
    setEditorStates((prev) => ({
      ...prev,
      [type]: RichUtils.toggleInlineStyle(prev[type], style),
    }));
  }, []);

  // Toggle Block Type
  const toggleBlockType = useCallback((blockType: string, type: DocumentType) => {
    setEditorStates((prev) => ({
      ...prev,
      [type]: RichUtils.toggleBlockType(prev[type], blockType),
    }));
  }, []);

  // Check if Inline Style is Active
  const isInlineStyleActive = useCallback(
    (style: string, type: DocumentType): boolean => {
      const currentStyle = editorStates[type].getCurrentInlineStyle();
      return currentStyle.has(style);
    },
    [editorStates]
  );

  // Check if Block Type is Active
  const isBlockTypeActive = useCallback(
    (blockType: string, type: DocumentType): boolean => {
      const editorState = editorStates[type];
      const selection = editorState.getSelection();
      const blockKey = selection.getStartKey();
      const currentBlock = editorState.getCurrentContent().getBlockForKey(blockKey);
      return currentBlock.getType() === blockType;
    },
    [editorStates]
  );

  // Check if document needs to be created (not found error)
  const needsCreation = useCallback(
    (type: DocumentType): boolean => {
      if (type === 'organizer_terms') {
        const isNotFound =
          organizerError &&
          typeof organizerError === 'object' &&
          'data' in organizerError &&
          organizerError.data !== null &&
          typeof organizerError.data === 'object' &&
          'message' in organizerError.data &&
          typeof organizerError.data.message === 'string' &&
          organizerError.data.message === TERMS_NOT_FOUND_MESSAGE;
        return Boolean(isNotFound);
      }

      if (type === 'customer_terms') {
        const isNotFound =
          customerError &&
          typeof customerError === 'object' &&
          'data' in customerError &&
          customerError.data !== null &&
          typeof customerError.data === 'object' &&
          'message' in customerError.data &&
          typeof customerError.data.message === 'string' &&
          customerError.data.message === TERMS_NOT_FOUND_MESSAGE;
        return Boolean(isNotFound);
      }

      if (type === 'privacy_policy') {
        const isNotFound =
          privacyError &&
          typeof privacyError === 'object' &&
          'data' in privacyError &&
          privacyError.data !== null &&
          typeof privacyError.data === 'object' &&
          'message' in privacyError.data &&
          typeof privacyError.data.message === 'string' &&
          (privacyError.data.message === PRIVACY_NOT_FOUND_MESSAGE || privacyError.data.message === TERMS_NOT_FOUND_MESSAGE);
        return Boolean(isNotFound);
      }

      return false;
    },
    [organizerError, customerError, privacyError]
  );

  // Save Handler
  const handleSave = useCallback(
    async (type: DocumentType) => {
      const html = convertEditorStateToHTML(editorStates[type]);
      const apiField = DOCUMENT_TYPE_CONFIG[type].apiField;
      const isCreate = needsCreation(type);

      try {
        let response;

        if (isCreate) {
          // CREATE - POST request
          const createPayload = {
            [apiField]: html,
          };
          response = await createSettings(createPayload).unwrap();
        } else {
          // UPDATE - PUT request
          const settingsId = settingsIds[type];
          if (!settingsId) {
            showError('Settings ID not found. Please refresh the page.');
            return;
          }

          const updatePayload = {
            id: settingsId,
            [apiField]: html,
          };
          response = await updateSettings(updatePayload).unwrap();
        }

        if (!response) {
          showError('No response from server. Please try again later.');
          return;
        }

        if ('error' in response && response.error) {
          const errorMessage = getErrorMessage(response.error);
          showError(errorMessage);
          return;
        }

        // Success
        const successMessage = response.message || `${DOCUMENT_TYPE_CONFIG[type].title} ${isCreate ? 'created' : 'updated'} successfully`;
        showSuccess(successMessage);

        // Update states after successful save
        setInitialContents((prev) => ({
          ...prev,
          [type]: html,
        }));

        setHasChanges((prev) => ({
          ...prev,
          [type]: false,
        }));

        // Update settings ID if it was a creation
        if (isCreate && response.data?._id) {
          setSettingsIds((prev) => ({
            ...prev,
            [type]: response.data._id,
          }));
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        showError(errorMessage);
      }
    },
    [editorStates, settingsIds, convertEditorStateToHTML, needsCreation, createSettings, updateSettings]
  );

  // Render Editor for each type
  const renderEditor = useCallback(
    (type: DocumentType) => {
      return (
        <RichTextEditor
          editorState={editorStates[type]}
          onEditorChange={(state) => handleEditorChange(state, type)}
          onKeyCommand={(command, state) => handleKeyCommand(command, state, type)}
          keyBindingFn={keyBindingFn}
          placeholder={DOCUMENT_TYPE_CONFIG[type].placeholder}
          onToggleInlineStyle={(style) => toggleInlineStyle(style, type)}
          onToggleBlockType={(blockType) => toggleBlockType(blockType, type)}
          isInlineStyleActive={(style) => isInlineStyleActive(style, type)}
          isBlockTypeActive={(blockType) => isBlockTypeActive(blockType, type)}
        />
      );
    },
    [editorStates, handleEditorChange, handleKeyCommand, keyBindingFn, toggleInlineStyle, toggleBlockType, isInlineStyleActive, isBlockTypeActive]
  );

  // Loading state
  const isLoading = isLoadingOrganizer || isLoadingCustomer || isLoadingPrivacy;
  const isSaving = isCreating || isUpdating;

  return (
    <>
      {isLoading ? (
        <AppLoading />
      ) : (
        <div className="container mx-auto w-full p-6">
          <style dangerouslySetInnerHTML={{ __html: editorStyles }} />

          <Card className="dark:bg-secondary w-full">
            <CardHeader>
              <CardTitle>
                <h2 className="text-xl">Legal Documents</h2>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DocumentType)} className="w-full">
                <TabsList className="grid h-12 w-full grid-cols-3">
                  <TabsTrigger value="organizer_terms" className="flex cursor-pointer items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Organizer Terms</span>
                    <span className="sm:hidden">Organizer</span>
                  </TabsTrigger>
                  <TabsTrigger value="customer_terms" className="flex cursor-pointer items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Customer Terms</span>
                    <span className="sm:hidden">Customer</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy_policy" className="flex cursor-pointer items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy Policy</span>
                    <span className="sm:hidden">Privacy</span>
                  </TabsTrigger>
                </TabsList>

                {/* Organizer Terms Tab */}
                <TabsContent value="organizer_terms" className="mt-3">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{DOCUMENT_TYPE_CONFIG.organizer_terms.title}</h3>
                    <div className="flex gap-2">
                      {isSaving ? (
                        <Button size="sm" className="flex items-center gap-2" disabled>
                          <ButtonLoading title="Saving" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSave('organizer_terms')}
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={!hasChanges.organizer_terms}
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                  {renderEditor('organizer_terms')}
                </TabsContent>

                {/* Customer Terms Tab */}
                <TabsContent value="customer_terms" className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{DOCUMENT_TYPE_CONFIG.customer_terms.title}</h3>
                    <div className="flex gap-2">
                      {isSaving ? (
                        <Button size="sm" className="flex items-center gap-2" disabled>
                          <ButtonLoading title="Saving" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSave('customer_terms')}
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={!hasChanges.customer_terms}
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                  {renderEditor('customer_terms')}
                </TabsContent>

                {/* Privacy Policy Tab */}
                <TabsContent value="privacy_policy" className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{DOCUMENT_TYPE_CONFIG.privacy_policy.title}</h3>
                    <div className="flex gap-2">
                      {isSaving ? (
                        <Button size="sm" className="flex items-center gap-2" disabled>
                          <ButtonLoading title="Saving" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleSave('privacy_policy')}
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={!hasChanges.privacy_policy}
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                  {renderEditor('privacy_policy')}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
