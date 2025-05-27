# Tiểu Phương Crochet Web Application

This is a [Next.js](https://nextjs.org) project for the Tiểu Phương Crochet website, featuring crochet patterns, products, and blog content.

## Features

- Multilingual support (Vietnamese and English)
- User authentication
- File uploads with Cloudflare R2 storage
- Blog and pattern management
- E-commerce functionality
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Cloudflare R2 account (for file storage)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Basic configuration
NEXTAUTH_SECRET=your_auth_secret
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_PAGE_SIZE=10

# Cloudflare R2 Configuration
NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY=your_access_key
NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_CLOUDFLARE_R2_CDN_URL=https://your-cdn-url.r2.dev
```

See the [Cloudflare R2 Integration Documentation](./docs/cloudflare-r2-integration.md) for more details on setting up file storage.

### Installation

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Upload with Cloudflare R2

This project uses Cloudflare R2 for file storage. The integration provides:

- Secure and reliable file storage
- CDN capabilities for fast content delivery
- S3-compatible API for easy integration
- Cost-effective storage solution

### Basic Usage

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
} else {
  // Handle upload error
  console.error(response.message);
}
```

For more detailed documentation, see the [Cloudflare R2 Integration Documentation](./docs/cloudflare-r2-integration.md).

## Deployment

The application can be deployed to any platform that supports Next.js applications:

- Vercel
- Netlify
- AWS Amplify
- Self-hosted servers

Make sure to configure the environment variables in your deployment environment.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
