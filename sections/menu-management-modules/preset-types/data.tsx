import { PresetCategoryOption, PresetSubcategoryOption, PresetTypeNameOption, PresetTypeRecord } from './types';

// TODO(v2-api): replace with the real Pleis taxonomy once the backend endpoint is ready.
// Pleis-internal classification (Croatian codes) — distinct from the organizer-facing
// English "Menu Subcategories" module; these two taxonomies serve different purposes.
export const mockPresetCategories: PresetCategoryOption[] = [
  { _id: 'preset-cat-1', code: 'PIĆA', title: 'Pića', codePrefix: 'PIC' },
  { _id: 'preset-cat-2', code: 'HRANA', title: 'Hrana', codePrefix: 'HRA' },
];

export const mockPresetSubcategories: PresetSubcategoryOption[] = [
  { _id: 'preset-subcat-1', title: 'Alkoholna pića – kokteli', categoryId: 'preset-cat-1' },
  { _id: 'preset-subcat-2', title: 'Vina i pjenušci', categoryId: 'preset-cat-1' },
  { _id: 'preset-subcat-3', title: 'Bezalkoholna pića', categoryId: 'preset-cat-1' },
  { _id: 'preset-subcat-4', title: 'Predjela', categoryId: 'preset-cat-2' },
  { _id: 'preset-subcat-5', title: 'Deserti', categoryId: 'preset-cat-2' },
  { _id: 'preset-subcat-6', title: 'Glavna jela', categoryId: 'preset-cat-2' },
];

export const mockPresetTypeNames: PresetTypeNameOption[] = [
  { _id: 'type-name-1', title: 'Signature kokteli', subcategoryId: 'preset-subcat-1' },
  { _id: 'type-name-2', title: 'Klasični kokteli', subcategoryId: 'preset-subcat-1' },
  { _id: 'type-name-3', title: 'Mocktail', subcategoryId: 'preset-subcat-1' },
  { _id: 'type-name-4', title: 'Pjenušavo vino', subcategoryId: 'preset-subcat-2' },
  { _id: 'type-name-5', title: 'Bijelo vino', subcategoryId: 'preset-subcat-2' },
  { _id: 'type-name-6', title: 'Crno vino', subcategoryId: 'preset-subcat-2' },
  { _id: 'type-name-7', title: 'Sokovi', subcategoryId: 'preset-subcat-3' },
  { _id: 'type-name-8', title: 'Gazirana pića', subcategoryId: 'preset-subcat-3' },
  { _id: 'type-name-9', title: 'Hladna predjela', subcategoryId: 'preset-subcat-4' },
  { _id: 'type-name-10', title: 'Topla predjela', subcategoryId: 'preset-subcat-4' },
  { _id: 'type-name-11', title: 'Kolači i torte', subcategoryId: 'preset-subcat-5' },
  { _id: 'type-name-12', title: 'Sladoledi', subcategoryId: 'preset-subcat-5' },
  { _id: 'type-name-13', title: 'Riba i plodovi mora', subcategoryId: 'preset-subcat-6' },
  { _id: 'type-name-14', title: 'Meso', subcategoryId: 'preset-subcat-6' },
  { _id: 'type-name-15', title: 'Vegetarijanska jela', subcategoryId: 'preset-subcat-6' },
];

// _id values below are kept stable — they're already referenced by menuItems' mockMenuItemsData (presetTypeId).
export const mockPresetTypeRecords: PresetTypeRecord[] = [
  { _id: 'preset-1', code: 'PIC037', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-1', typeNameId: 'type-name-1', status: 'active', createdAt: '2026-01-05' },
  { _id: 'preset-2', code: 'PIC034', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-1', typeNameId: 'type-name-2', status: 'active', createdAt: '2026-01-05' },
  { _id: 'preset-3', code: 'HRA004', categoryId: 'preset-cat-2', subcategoryId: 'preset-subcat-4', typeNameId: 'type-name-9', status: 'active', createdAt: '2026-01-03' },
  { _id: 'preset-4', code: 'PIC021', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-2', typeNameId: 'type-name-4', status: 'active', createdAt: '2026-01-04' },
  { _id: 'preset-5', code: 'HRA035', categoryId: 'preset-cat-2', subcategoryId: 'preset-subcat-5', typeNameId: 'type-name-11', status: 'active', createdAt: '2026-02-10' },
  { _id: 'preset-6', code: 'PIC001', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-1', typeNameId: 'type-name-3', status: 'active', createdAt: '2026-01-05' },
  { _id: 'preset-7', code: 'PIC010', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-2', typeNameId: 'type-name-5', status: 'active', createdAt: '2026-01-05' },
  { _id: 'preset-8', code: 'PIC011', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-2', typeNameId: 'type-name-6', status: 'active', createdAt: '2026-01-05' },
  { _id: 'preset-9', code: 'PIC020', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-3', typeNameId: 'type-name-7', status: 'active', createdAt: '2026-01-06' },
  { _id: 'preset-10', code: 'PIC022', categoryId: 'preset-cat-1', subcategoryId: 'preset-subcat-3', typeNameId: 'type-name-8', status: 'inactive', createdAt: '2026-01-06' },
  { _id: 'preset-11', code: 'HRA010', categoryId: 'preset-cat-2', subcategoryId: 'preset-subcat-4', typeNameId: 'type-name-10', status: 'active', createdAt: '2026-01-06' },
  { _id: 'preset-12', code: 'HRA020', categoryId: 'preset-cat-2', subcategoryId: 'preset-subcat-6', typeNameId: 'type-name-13', status: 'active', createdAt: '2026-02-11' },
  { _id: 'preset-13', code: 'HRA021', categoryId: 'preset-cat-2', subcategoryId: 'preset-subcat-6', typeNameId: 'type-name-14', status: 'active', createdAt: '2026-02-11' },
  { _id: 'preset-14', code: 'HRA022', categoryId: 'preset-cat-2', subcategoryId: 'preset-subcat-6', typeNameId: 'type-name-15', status: 'active', createdAt: '2026-02-11' },
  { _id: 'preset-15', code: 'HRA036', categoryId: 'preset-cat-2', subcategoryId: 'preset-subcat-5', typeNameId: 'type-name-12', status: 'inactive', createdAt: '2026-02-10' },
];

export const getNextPresetTypeCode = (records: PresetTypeRecord[], categoryId: string): string => {
  const category = mockPresetCategories.find((cat) => cat._id === categoryId);
  const prefix = category?.codePrefix || '';
  const maxNumber = records
    .filter((record) => record.categoryId === categoryId)
    .reduce((max, record) => {
      const num = parseInt(record.code.replace(prefix, ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
  return `${prefix}${String(maxNumber + 1).padStart(3, '0')}`;
};

// Compatibility export consumed by sections/menu-management-modules/menuItems — kept in sync automatically.
export const mockPresetTypes = mockPresetTypeRecords
  .filter((record) => record.status === 'active')
  .map((record) => ({
    _id: record._id,
    code: record.code,
    label: record.name || mockPresetTypeNames.find((typeName) => typeName._id === record.typeNameId)?.title || record.code,
  }));
