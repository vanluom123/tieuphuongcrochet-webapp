import { API_ROUTES } from "@/app/lib/constant";
import { getSession } from "next-auth/react";

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.url = API_ROUTES.R2_PRESIGNED; // API r2 server
    this.page = page || "ckeditor";
    this.category = category || "inline";
  }

  async upload() {
    const file = await this.loader.file;

    return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("page", this.page);
      formData.append("category", this.category);

      const session = await getSession();
      const token = session?.user?.accessToken;

      try {
        const response = await fetch(this.url, {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || result.error) {
          return reject(result.error || "Upload failed");
        }

        // Do API trả về dạng: { publicUrls: [...] }
        const uploaded = result.publicUrls?.[0];
        if (!uploaded?.fileContent) {
          return reject("No URL returned from server");
        }

        resolve({
          default: uploaded.fileContent, // URL ảnh được CKEditor sử dụng
        });
      } catch (error) {
        console.error("Upload error:", error);
        reject("Không thể upload ảnh.");
      }
    });
  }

  abort() {
    // Tùy chọn: nếu bạn muốn xử lý cancel upload
  }
}

export function MyCustomUploadAdapterPluginWithMeta(editor) {
  return function (editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, page, category);
    };
  };}
