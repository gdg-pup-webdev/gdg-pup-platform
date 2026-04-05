# Google Cloud Storage Local Setup

This guide sets up local upload and delete testing with Node.js scripts in `scripts/`.

## 1) Create a bucket

1. Open Google Cloud Console.
2. Create a Cloud Storage bucket.
3. Recommended: keep Uniform bucket-level access enabled.

## 2) Create service account credentials

1. Go to IAM & Admin -> Service Accounts.
2. Create a service account for local testing.
3. Grant bucket access roles:
   - Storage Object Admin (upload/delete)
4. Create a JSON key for this service account.
5. Save the key JSON as `apps/nexus-api/gcp-service-account.json` (do not commit it).

## 3) Configure environment variables

Put the GCS variables in your existing API env file:
- `apps/nexus-api/.env`

Copy this block into `apps/nexus-api/.env` and adjust values:

```dotenv
GCS_PROJECT_ID=gdgpup-484914
GCS_BUCKET_NAME=gdgpuporg
GCS_CREDENTIALS_FILE=apps/nexus-api/gcp-service-account.json
GCS_UPLOAD_PREFIX=local-test
GCS_PREVIEW_URL_TYPE=signed
GCS_SIGNED_URL_EXPIRES_SECONDS=900
GCS_MAKE_PUBLIC_ON_UPLOAD=false
GCS_PUBLIC_BASE_URL=https://storage.googleapis.com
```

Required variables:
- `GCS_PROJECT_ID`: your GCP project ID
- `GCS_BUCKET_NAME`: target bucket name
- `GCS_CREDENTIALS_FILE`: path to your service account key JSON

Optional variables:
- `GCS_UPLOAD_PREFIX`: folder prefix for generated object paths
- `GCS_PREVIEW_URL_TYPE`: `signed` (default) or `public`
- `GCS_SIGNED_URL_EXPIRES_SECONDS`: signed preview validity in seconds (default `900`)
- `GCS_MAKE_PUBLIC_ON_UPLOAD`: only relevant when `GCS_PREVIEW_URL_TYPE=public`
- `GCS_PUBLIC_BASE_URL`: base URL for `publicPreviewUrl`, defaults to `https://storage.googleapis.com`

## 4) Preview URL behavior

Default mode is signed URLs (`GCS_PREVIEW_URL_TYPE=signed`).
This works even when your bucket has Public Access Prevention enforced.

Upload response includes:
- `previewUrl`: use this URL for browser preview
- `previewUrlType`: `signed` or `public`
- `previewUrlExpiresAt`: ISO expiry time for signed URLs
- `publicPreviewUrl`: canonical public URL form (may not be accessible)

If you need always-public URLs, set `GCS_PREVIEW_URL_TYPE=public`.
Then objects must be publicly readable.

Public URL format:
- `https://storage.googleapis.com/<bucket>/<objectPath>`

For public mode URLs to be accessible in a browser, objects must be publicly readable.

Recommended with uniform bucket-level access:
1. Add IAM principal `allUsers` on the bucket.
2. Grant role `Storage Object Viewer`.

If your organization blocks public buckets, use signed mode.

## 5) Run local test

Upload then delete immediately:

```bash
pnpm gcs:test
```

Upload only (keep object in bucket):

```bash
pnpm gcs:test:keep
```

Both commands read env from `apps/nexus-api/.env`.

## Returned values

Upload returns:
- `reference`: `gcs://<bucket>/<objectPath>`
- `previewUrl`: preview URL to use immediately (signed by default)
- `previewUrlType`: `signed` or `public`
- `publicPreviewUrl`: canonical public URL form
- `bucketName`
- `objectPath`

Delete accepts:
- `reference` from upload response
