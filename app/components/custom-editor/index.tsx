import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { EventInfo } from "@ckeditor/ckeditor5-utils";
import type { Editor } from "@ckeditor/ckeditor5-core";
import { MyCustomUploadAdapterPluginWithMeta } from "./MyUploadAdapter";

interface EditorProps {
  onBlur?: (event: EventInfo, editor: Editor) => void;
  placeholder?: string;
  initialData?: string;
  page: string;
  category?: string;
}

const CustomEditor = ({
  onBlur,
  placeholder,
  initialData = "",
  page,
  category = "editor",
}: EditorProps) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={initialData}
      config={{
        extraPlugins: [
          MyCustomUploadAdapterPluginWithMeta({
            page,
            category,
          }),
        ],
        placeholder: placeholder || "Enter the text",
        mediaEmbed: {
          previewsInData: true,
        },
      }}
      onBlur={onBlur}
    />
  );
};

export default CustomEditor;
