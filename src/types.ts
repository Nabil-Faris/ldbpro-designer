export type ComponentType =
  | 'richText'
  | 'imageBanner'
  | 'genericBanner'
  | 'video'
  | 'button';

export interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'textarea';
  required?: boolean;
}

export interface ComponentSchema {
  type: ComponentType;
  name: string;
  fields: FieldSchema[];
}

export type ComponentData = Record<string, string>;

export interface PageComponent {
  id: string;
  type: ComponentType;
  data: ComponentData;
}

export interface PageDataModel {
  pageName: string;
  components: PageComponent[];
}

export const COMPONENT_SCHEMAS: Record<ComponentType, ComponentSchema> = {
  richText: {
    type: 'richText',
    name: 'RichText',
    fields: [
      { name: 'content', label: 'Contenu', type: 'textarea', required: true },
    ],
  },
  imageBanner: {
    type: 'imageBanner',
    name: 'Image Banner',
    fields: [
      { name: 'imageUrl', label: "URL de l'image", type: 'text', required: true },
      { name: 'title', label: 'Titre', type: 'text', required: true },
    ],
  },
  genericBanner: {
    type: 'genericBanner',
    name: 'Generic Banner',
    fields: [
      { name: 'imageUrl', label: "URL de l'image", type: 'text', required: true },
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'text', label: 'Texte', type: 'textarea', required: true },
    ],
  },
  video: {
    type: 'video',
    name: 'Vidéo',
    fields: [
      { name: 'videoUrl', label: 'URL de la vidéo', type: 'text', required: true },
      { name: 'embedCode', label: 'Code embed (optionnel)', type: 'textarea' },
    ],
  },
  button: {
    type: 'button',
    name: 'Bouton',
    fields: [
      { name: 'text', label: 'Texte du bouton', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'text', required: true },
    ],
  },
};

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyComponent(type: ComponentType): PageComponent {
  const schema = COMPONENT_SCHEMAS[type];
  const data: ComponentData = {};
  schema.fields.forEach((field) => {
    data[field.name] = '';
  });
  return { id: generateId(), type, data };
}

