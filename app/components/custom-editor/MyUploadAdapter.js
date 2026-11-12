import { uploadImageToR2 } from "@/app/lib/service/r2Service";

class MyUploadAdapter {
  constructor(loader, page = "general", category = "uncategorized") {
    this.loader = loader;
    this.page = page;
    this.category = category;
  }

  async upload() {
    const file = await this.loader.file;
    const uploaded = await uploadImageToR2(file, this.page, this.category);
    return { default: uploaded[0].fileContent };
  }

  abort() {
    // Tùy chọn: nếu bạn muốn xử lý cancel upload
  }
}

export function MyCustomUploadAdapterPluginWithMeta({ page = "general", category = "uncategorized" } = {}) {
  return function (editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, page, category);
    };
  };
}
