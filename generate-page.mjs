// RUNNING INSTRUCTIONS:
// node generate-page.mjs super-admin menu-item

import fs from 'fs';
import path from 'path';

/**
 * Generate Next.js page folder
 * @param {string} folderType - Type of folder (super-admin, organizer)
 * @param {string} pageName - Name of the page (e.g., 'menu-item', 'categories')
 */
function generateNextJsPage(folderType, pageName) {
  if (!folderType || !pageName) {
    console.error('❌ Error: Both folder type and page name are required!');
    console.log('Usage: node generate-page.mjs <folderType> <pageName>');
    console.log('Example: node generate-page.mjs super-admin menu-item');
    console.log('Example: node generate-page.mjs organizer categories');
    process.exit(1);
  }

  // Validate folder type
  const validFolderTypes = ['super-admin', 'organizer'];
  if (!validFolderTypes.includes(folderType)) {
    console.error(`❌ Error: Invalid folder type "${folderType}"`);
    console.log('Valid folder types are: super-admin, organizer');
    process.exit(1);
  }

  // Normalize names
  const pageNameKebab = toKebabCase(pageName);
  const pageNamePascal = toPascalCase(pageName);
  // const pageNameCamel = toCamelCase(pageName);
  const pageNameTitle = toTitleCase(pageName);

  // Create the page content
  const pageContent = `import Header from '@/app/common/header';
import ${pageNamePascal}View from '@/sections/${pageNameKebab}/${pageNameKebab}-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${pageNameTitle} - Pleis',
};

const Page = () => {
  return (
    <div className="min-h-screen pb-12">
      <Header
        links={[
          { name: 'Dashboard', href: '/${folderType}' },
          { name: '${pageNameTitle}', href: '' },
        ]}
      />

      <${pageNamePascal}View />
    </div>
  );
};

export default Page;
`;

  // Define the output directory and file path
  const outputDir = path.join(process.cwd(), 'app', folderType, `(${folderType})`, pageNameKebab);
  const outputFile = path.join(outputDir, 'page.tsx');

  // Check if directory already exists
  if (fs.existsSync(outputDir)) {
    console.error(`❌ Error: Folder already exists at ${outputDir}`);
    console.log('Please delete the existing folder or use a different page name.');
    process.exit(1);
  }

  // Create directory
  try {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created directory: ${outputDir}`);
  } catch (error) {
    console.error('❌ Error creating directory:', error.message);
    process.exit(1);
  }

  // Write the page file
  try {
    fs.writeFileSync(outputFile, pageContent, 'utf8');
    console.log(`✅ Successfully generated: ${outputFile}`);
    console.log('\n📝 Next steps:');
    console.log(`1. Create the view component at: /sections/${pageNameKebab}/${pageNameKebab}-view.tsx`);
    console.log(`2. Uncomment the <${pageNamePascal}View /> line in the page once the view is created`);
    console.log(`3. Access the page at: /${folderType}/${pageNameKebab}`);
  } catch (error) {
    console.error('❌ Error writing file:', error.message);
    process.exit(1);
  }
}

// Helper functions for string transformations
// function toCamelCase(str) {
//   return str
//     .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
//       return index === 0 ? word.toLowerCase() : word.toUpperCase();
//     })
//     .replace(/\s+/g, '')
//     .replace(/[-_]/g, '');
// }

function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]/g, '-')
    .toLowerCase();
}

function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Get arguments from command line
const folderType = process.argv[2];
const pageName = process.argv[3];

// Generate the page
generateNextJsPage(folderType, pageName);