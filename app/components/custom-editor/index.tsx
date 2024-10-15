import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { EventInfo } from '@ckeditor/ckeditor5-utils';
import type { Editor } from '@ckeditor/ckeditor5-core';
import { MyCustomUploadAdapterPlugin } from './MyUploadAdapter';

interface EditorProps {
	onBlur?: (event: EventInfo, editor: Editor) => void;
	placeholder?: string;
	initialData?: string;
}

const CustomEditor = ({ onBlur, placeholder, initialData = '' }: EditorProps) => {

	return (
		<CKEditor
			editor={ClassicEditor}
			data={initialData}
			config={{
				extraPlugins: [MyCustomUploadAdapterPlugin],
				placeholder: placeholder || 'Enter the text',
				mediaEmbed: {
					previewsInData: true
			}
			}}
			onBlur={onBlur}
		/>
	);
}

export default CustomEditor;