import type { DocumentType } from './types';

export const DOCUMENT_TYPE_CONFIG: Record<
  DocumentType,
  {
    title: string;
    apiField: string;
    placeholder: string;
  }
> = {
  organizer_terms: {
    title: 'Terms & Conditions for Organizers',
    apiField: 'terms_and_conditions',
    placeholder: 'Enter organizer terms & conditions here...',
  },
  customer_terms: {
    title: 'Terms & Conditions for Customers',
    apiField: 'customer_terms_and_conditions',
    placeholder: 'Enter customer terms & conditions here...',
  },
  privacy_policy: {
    title: 'Privacy Policy',
    apiField: 'privacy_policy',
    placeholder: 'Enter privacy policy here...',
  },
};

export const TERMS_NOT_FOUND_MESSAGE = 'Terms and Conditions not found';
export const PRIVACY_NOT_FOUND_MESSAGE = 'Privacy Policy not found';

export const editorStyles = `
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
