// RUNNING INSTRUCTIONS:
// node generate-rtk.mjs products

import fs from 'fs';
import path from 'path';

/**
 * Generate RTK Query API file
 * @param {string} moduleName - Name of the module (e.g., 'categories', 'products')
 */
function generateRTKFile(moduleName) {
  if (!moduleName) {
    console.error('❌ Error: Module name is required!');
    console.log('Usage: node generate-rtk.mjs <moduleName>');
    console.log('Example: node generate-rtk.mjs products');
    process.exit(1);
  }

  // Normalize module name
  const moduleNameLower = moduleName.toLowerCase();
  const moduleNameCamel = toCamelCase(moduleName);
  const moduleNamePascal = toPascalCase(moduleName);
  const moduleNameSingular = removePlural(moduleNameLower);
  const moduleNameSingularPascal = toPascalCase(moduleNameSingular);
  const fileName = toKebabCase(moduleName);
  const apiName = `${moduleNameCamel}Api`;

  // Create the file content
  const fileContent = `import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const ${apiName} = createApi({
  reducerPath: '${apiName}',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['${moduleNameSingular}'],

  endpoints: (builder) => ({
    get${moduleNamePascal}: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.${toConstantCase(moduleName)},
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['${moduleNameSingular}'],
    }),

    add${moduleNameSingularPascal}: builder.mutation({
      query: (new${moduleNameSingularPascal}) => ({
        url: API_ROUTES.${toConstantCase(moduleName)},
        method: 'POST',
        body: new${moduleNameSingularPascal},
      }),
      invalidatesTags: ['${moduleNameSingular}'],
    }),

    update${moduleNameSingularPascal}: builder.mutation({
      query: ({ id, ...updated${moduleNameSingularPascal} }) => ({
        url: API_ROUTES.${toConstantCase(moduleName)}_BY_ID(id),
        method: 'PUT',
        body: updated${moduleNameSingularPascal},
      }),
      invalidatesTags: ['${moduleNameSingular}'],
    }),

    delete${moduleNameSingularPascal}: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.${toConstantCase(moduleName)}_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['${moduleNameSingular}'],
    }),
  }),
});

export const {
  useGet${moduleNamePascal}Query,
  useAdd${moduleNameSingularPascal}Mutation,
  useUpdate${moduleNameSingularPascal}Mutation,
  useDelete${moduleNameSingularPascal}Mutation,
} = ${apiName};
`;

  // Define the output directory and file path
  const outputDir = path.join(process.cwd(), 'store', 'Reducer');
  const outputFile = path.join(outputDir, `${fileName}-api.tsx`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created directory: ${outputDir}`);
  }

  // Check if file already exists
  if (fs.existsSync(outputFile)) {
    console.error(`❌ Error: File already exists at ${outputFile}`);
    console.log('Please delete the existing file or use a different module name.');
    process.exit(1);
  }

  // Write the API file
  try {
    fs.writeFileSync(outputFile, fileContent, 'utf8');
    console.log(`✅ Successfully generated: ${outputFile}`);
  } catch (error) {
    console.error('❌ Error writing API file:', error.message);
    process.exit(1);
  }

  // Update store.ts file
  updateStoreFile(apiName, fileName);
}

/**
 * Update store.tsx file with new API
 * @param {string} apiName - API name in camelCase (e.g., 'productsApi')
 * @param {string} fileName - File name in kebab-case (e.g., 'products-api')
 */
function updateStoreFile(apiName, fileName) {
  const storeFilePath = path.join(process.cwd(), 'store', 'store.tsx');

  if (!fs.existsSync(storeFilePath)) {
    console.error('❌ Error: store.tsx file not found at', storeFilePath);
    console.log('Please manually add the API to your store file.');
    return;
  }

  try {
    let storeContent = fs.readFileSync(storeFilePath, 'utf8');

    // 1. Add import statement (after other imports, before resetStore)
    const importStatement = `import { ${apiName} } from './Reducer/${fileName}-api';\n`;
    const resetStoreIndex = storeContent.indexOf('export const resetStore');

    if (storeContent.includes(importStatement.trim())) {
      console.log('⚠️  Import already exists in store.tsx');
      return;
    }

    // Find the last import statement before resetStore
    const importsSection = storeContent.substring(0, resetStoreIndex);
    const lastImportIndex = importsSection.lastIndexOf('import ');
    const nextLineAfterLastImport = storeContent.indexOf('\n', lastImportIndex) + 1;

    storeContent =
      storeContent.slice(0, nextLineAfterLastImport) +
      importStatement +
      storeContent.slice(nextLineAfterLastImport);

    // 2. Add reducer in combineReducers
    const combineReducersMatch = storeContent.match(/const appReducer = combineReducers\(\{[\s\S]*?\}\);/);
    if (combineReducersMatch) {
      const combineReducersBlock = combineReducersMatch[0];
      // const lastReducerLine = combineReducersBlock.lastIndexOf('[');
      const beforeClosingBrace = combineReducersBlock.lastIndexOf('}');

      const newReducerLine = `  [${apiName}.reducerPath]: ${apiName}.reducer,\n`;

      const updatedCombineReducers =
        combineReducersBlock.slice(0, beforeClosingBrace) +
        newReducerLine +
        combineReducersBlock.slice(beforeClosingBrace);

      storeContent = storeContent.replace(combineReducersBlock, updatedCombineReducers);
    }

    // 3. Add middleware in configureStore
    const middlewareMatch = storeContent.match(/middleware: \(getDefaultMiddleware\) =>\s+getDefaultMiddleware\(\)\.concat\(([\s\S]*?)\),/);
    if (middlewareMatch) {
      const middlewareBlock = middlewareMatch[0];
      const middlewareList = middlewareMatch[1];

      const newMiddleware = `${apiName}.middleware,\n      `;
      const lastCommaIndex = middlewareList.lastIndexOf(',');

      const updatedMiddlewareList =
        middlewareList.slice(0, lastCommaIndex + 1) +
        '\n      ' + newMiddleware.trim() +
        middlewareList.slice(lastCommaIndex + 1);

      const updatedMiddlewareBlock = middlewareBlock.replace(middlewareList, updatedMiddlewareList);
      storeContent = storeContent.replace(middlewareBlock, updatedMiddlewareBlock);
    }

    // Write updated store file
    fs.writeFileSync(storeFilePath, storeContent, 'utf8');
    console.log(`✅ Successfully updated store.tsx with ${apiName}`);
    console.log('\n📝 Next steps:');
    console.log(`1. Add API_ROUTES.${toConstantCase(fileName)} to your apiRoutes file`);
    console.log(`2. Add API_ROUTES.${toConstantCase(fileName)}_BY_ID to your apiRoutes file`);

  } catch (error) {
    console.error('❌ Error updating store.tsx:', error.message);
    console.log('Please manually add the following to your store.tsx:');
    console.log(`\nImport: import { ${apiName} } from './Reducer/${fileName}-api';`);
    console.log(`Reducer: [${apiName}.reducerPath]: ${apiName}.reducer,`);
    console.log(`Middleware: ${apiName}.middleware,`);
  }
}

// Helper functions for string transformations
function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
      return word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

function toConstantCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]/g, '_')
    .toUpperCase();
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]/g, '-')
    .toLowerCase();
}

function removePlural(str) {
  // Simple plural removal (handles most common cases)
  if (str.endsWith('ies')) {
    return str.slice(0, -3) + 'y';
  } else if (str.endsWith('ses') || str.endsWith('ches') || str.endsWith('xes')) {
    return str.slice(0, -2);
  } else if (str.endsWith('s')) {
    return str.slice(0, -1);
  }
  return str;
}

// Get module name from command line arguments
const moduleName = process.argv[2];

// Generate the file
generateRTKFile(moduleName);