# Cloudflare R2 Integration Documentation

This document provides information on how the Cloudflare R2 storage integration is implemented in the tieuphuongcrochet-webapp project for file uploads.

## Overview

Cloudflare R2 is used as the primary storage solution for file uploads in this application. It provides:

- Secure and reliable file storage
- CDN capabilities for fast content delivery
- S3-compatible API for easy integration
- Cost-effective storage solution

## Configuration

### Environment Variables

The following environment variables need to be configured for the Cloudflare R2 integration to work:

```
NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY=your_access_key_here
NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_CLOUDFLARE_R2_CDN_URL=https://your-cdn-url.r2.dev
```

These variables should be added to your `.env.local` file for local development and configured in your deployment environment for production.

### Obtaining Cloudflare R2 Credentials

1. Log in to your Cloudflare dashboard
2. Navigate to R2 in the sidebar
3. Create a new bucket or select an existing one
4. Go to "R2 API Tokens" and create a new API token with read/write permissions
5. Copy the Access Key ID and Secret Access Key
6. Note your bucket name and account ID for the endpoint URL

### Setting Up Cloudflare R2 CDN (Optional but Recommended)

To serve files through Cloudflare's CDN:

1. In your Cloudflare dashboard, go to R2 > Your Bucket
2. Click on "Settings" > "Public Access"
3. Create a new public access policy
4. Configure the policy to allow public access to your files
5. Copy the provided CDN URL and set it as `NEXT_PUBLIC_CLOUDFLARE_R2_CDN_URL`

## Usage

### Basic File Upload

To upload a file to Cloudflare R2:

```typescript
import uploadFile from "@/app/lib/service/uploadFilesSevice";

// Create a FormData object
const formData = new FormData();
formData.append('files', fileObject);

// Upload the file
const response = await uploadFile.upload(formData);

if (response.success) {
  // File uploaded successfully
  const fileUrl = response.data[0].fileContent;
  const fileName = response.data[0].fileName;
  
  // Use the file URL and name as needed
} else {
  // Handle upload error
  console.error(response.message);
}
```

### Multiple File Upload

To upload multiple files:

```typescript
const formData = new FormData();
files.forEach(file => {
  formData.append('files', file);
});

const response = await uploadFile.upload(formData);

if (response.success) {
  // Files uploaded successfully
  const uploadedFiles = response.data;
  
  // Process each uploaded file
  uploadedFiles.forEach(file => {
    console.log(`File ${file.fileName} uploaded to ${file.fileContent}`);
  });
} else {
  // Handle upload error
  console.error(response.message);
}
```

### Deleting Files

To delete files from Cloudflare R2:

```typescript
const fileNames = ['prod/1234567890-abcdef.jpg', 'prod/0987654321-ghijkl.png'];
const response = await uploadFile.delete(fileNames);

if (response.success) {
  // All files deleted successfully
} else {
  // Some files failed to delete
  console.error(`Failed to delete: ${response.failedFiles?.join(', ')}`);
}
```

### Listing Files

To list files in a directory:

```typescript
// List all files in the 'prod' directory
const files = await uploadFile.listFiles('prod');

// List all files in the root directory
const rootFiles = await uploadFile.listFiles();
```

## Integration with CKEditor

The application includes a custom upload adapter for CKEditor that uses Cloudflare R2 for image uploads. This is implemented in `app/components/custom-editor/MyUploadAdapter.js`.

When a user uploads an image through the CKEditor interface, the file is automatically uploaded to Cloudflare R2 and the URL is inserted into the editor.

## Error Handling

The Cloudflare R2 service includes comprehensive error handling:

- All operations are wrapped in try/catch blocks
- Detailed error messages are logged to the console
- User-friendly error messages are returned
- Failed operations return appropriate error responses

## Limitations

- Maximum file size: 5MB per file
- Supported file types: Images (jpg, png, gif, webp), Documents (pdf, doc, docx)
- Files are stored in a directory structure based on the environment (e.g., `prod/` or `dev/`)

## Troubleshooting

If you encounter issues with the Cloudflare R2 integration:

1. Check that all environment variables are correctly configured
2. Verify that your Cloudflare R2 API tokens have the correct permissions
3. Ensure your bucket exists and is properly configured
4. Check the browser console for detailed error messages
5. Verify network connectivity to Cloudflare R2 endpoints

## Security Considerations

- The Cloudflare R2 access keys are exposed to the client side as they use the `NEXT_PUBLIC_` prefix
- For production, consider implementing a server-side API endpoint for file uploads
- Use Cloudflare R2 access policies to restrict access to your bucket
- Implement file type validation and scanning for uploaded files

## Future Improvements

- Implement server-side upload handling to keep credentials private
- Add support for larger file uploads with chunked uploading
- Implement file type validation and virus scanning
- Add support for folder organization and management
