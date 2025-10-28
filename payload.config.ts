import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [],

  // Payload Secret
  secret: process.env.PAYLOAD_SECRET || "",
  // Untuk koneksi ke Database
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.SSL_CA,
      },
    },
  }),
  plugins: [
    // Untuk koneksi ke Amazon S3
    s3Storage({
      collections: {
        media: {
          prefix: "custom-prefix",
          signedDownloads: {
            shouldUseSignedURL: ({ collection, filename, req }) => {
              return filename.endsWith(".mp4");
            },
          },
        },
      },
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
        // Opsi ini penting agar URL yang dihasilkan oleh Payload benar
        forcePathStyle: true,
      },
      bucket: process.env.S3_BUCKET,
    }),
  ],
  sharp,
});
