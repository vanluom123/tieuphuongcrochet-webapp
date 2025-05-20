import cloudflareR2Service from "@/app/lib/service/cloudflareR2Service";

class MyUploadAdapter {
	constructor( loader ) {
			// The file loader instance to use during the upload.
			this.loader = loader;
	}

	// Starts the upload process.
	upload() {
			// Return a promise that resolves when the file is uploaded
			return this.loader.file.then(file => {
				// Set up progress reporting
				this._initLoader(file);

				// Upload the file directly to Cloudflare R2
				return cloudflareR2Service.uploadFile(file)
					.then(response => {
						// Return an object with the URL of the uploaded file
						return {
							default: response.fileContent
						};
					})
					.catch(error => {
						// Handle upload error
						console.error('Upload error:', error);
						throw new Error(`Couldn't upload file: ${file.name}`);
					});
			});
	}

	// Aborts the upload process.
	abort() {
			// Not applicable with direct R2 upload as we don't have an abort mechanism
			// We could implement a cancel token pattern if needed in the future
	}

	// Set up progress tracking for the upload
	_initLoader(file) {
			// For direct uploads, we can't track real-time progress easily
			// Just set the total size for the progress bar
			const loader = this.loader;
			loader.uploadTotal = file.size;
			
			// We could implement a mock progress that increases gradually
			// But for now, we'll just show the full progress when complete
	}
}

export function MyCustomUploadAdapterPlugin( editor ) {
	editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
			// Configure the URL to the upload script in your back-end here!
			return new MyUploadAdapter( loader );	
	};
}
