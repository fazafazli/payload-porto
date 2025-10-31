import { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: ({ req }) => (req.user ? true : false),
    update: ({ req }) => (req.user ? true : false),
    delete: ({ req }) => (req.user ? true : false),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
};