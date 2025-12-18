module.exports = ({ env }) => ({
  // Upload plugin configuration for FPT Storage / AWS S3 compatible
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          accessKeyId: env('STORAGE_ACCESS_KEY'),
          secretAccessKey: env('STORAGE_SECRET_KEY'),
          region: env('STORAGE_REGION', 'ap-southeast-1'),
          endpoint: env('STORAGE_ENDPOINT'),
          params: {
            Bucket: env('STORAGE_BUCKET', 'woman-ecomm'),
          },
          forcePathStyle: true, // Required for FPT Storage compatibility
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  // SEO plugin
  seo: {
    enabled: true,
  },
  // i18n for Vietnamese
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'vi',
      locales: ['vi', 'en'],
    },
  },
  // Slugify for auto-generating slugs
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        product: {
          field: 'slug',
          references: 'name',
        },
        category: {
          field: 'slug',
          references: 'name',
        },
        brand: {
          field: 'slug',
          references: 'name',
        },
        collection: {
          field: 'slug',
          references: 'name',
        },
      },
    },
  },
});
