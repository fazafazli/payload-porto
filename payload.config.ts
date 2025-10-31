import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    'http://localhost:3000',
    'http://localhost:3001', // local development
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  editor: lexicalEditor(),

  collections: [
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          unique: true,
        },
      ],
    },
    {
      slug: 'posts',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      slug: 'projects',
      admin: {
        useAsTitle: 'title',
      },
      access: {
        read: () => true,
        create: ({ req }) => (req.user ? true : false),
        update: ({ req }) => (req.user ? true : false),
        delete: ({ req }) => (req.user ? true : false),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'technologies',
          type: 'array',
          fields: [
            {
              name: 'tech',
              type: 'text',
            },
          ],
        },
        {
          name: 'liveUrl',
          type: 'text',
          label: 'Live URL',
        },
        {
          name: 'github',
          type: 'text',
          label: 'GitHub URL',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
        },
      ],
      timestamps: true,
    },
    {
      slug: 'media',
      upload: true,
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
    },
  ],

  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
        ca: process.env.SSL_CA,
      },
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
          signedDownloads: false,
          disableLocalStorage: true,
        },
      },
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION,
        forcePathStyle: true,
      },
      bucket: process.env.S3_BUCKET!,
    }),
  ],
  sharp,
});