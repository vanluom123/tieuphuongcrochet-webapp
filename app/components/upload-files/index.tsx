import { memo, useEffect, useState } from "react";
import ImgCrop from "antd-img-crop";
import { filter, map } from "lodash";
import { UploadOutlined } from "@ant-design/icons";
import { Modal, Radio, Upload, UploadFile, UploadProps, message } from "antd";

import { FileUpload, UPLOAD_MODES } from "@/app/lib/definitions";
import { UploadMode } from "@/app/lib/definitions";
import { getBase64, uid } from "@/app/lib/utils";
import { notification } from "@/app/lib/notify";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface UploadFilesProps extends UploadProps {
  onChangeFile: (files: FileUpload[]) => void;
  files?: FileUpload[];
  imgsNumber?: number;
  isMultiple?: boolean;
  isShowDirectory?: boolean;
  defaultImageMode?: "crop" | "normal";
}

const UploadFiles = ({
  defaultImageMode = "crop",
  onChangeFile,
  files,
  imgsNumber = 20,
  isMultiple = true,
  isShowDirectory = true,
}: UploadFilesProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageMode, setImageMode] = useState<UploadMode>(defaultImageMode);
  const [modal, contextHolder] = Modal.useModal();
  const t = useTranslations("UploadFiles");

  useEffect(() => {
    if (files && files.length > 0) {
      setFileList(files);
    }
  }, [files]);

  // Add this effect near your other useEffects
  useEffect(() => {
    if (fileList.length > 0) {
      onChangeFile(fileList);
    }
  }, [fileList]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const customUploadFiles = async ({ file, onError }: any) => {
    const isLimit5Mb = file?.size / 1024 / 1024 < 5;
    if (!isLimit5Mb) {
      onError("fail");
      notification.error({
        message: "Error",
        description: t('error_5mb'),
      });
      return;
    }

    const newFile: UploadFile = {
      uid: uid(),
      name: file.name,
      url: URL.createObjectURL(file),
      originFileObj: file,
    };

    setFileList((prevState) => [...prevState, newFile]);
  };

  const onDelete = async (file: UploadFile) => {
    modal.confirm({
      title: t("confirm_delete"),
      okText: t("confirm_yes"),
      cancelText: t("confirm_no"),
      async onOk() {
        const newFileList = filter(fileList, (f) => f.url !== file.url);
        setFileList(newFileList);
        onChangeFile(newFileList);
      },
    });
  };

  const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error(t('error_5mb'));
    }
    return isLt2M;
  };

  const uploadNode = (
    <Upload
      accept="image/png,image/jpeg,image/jpg,.pdf,.doc,.docx"
      customRequest={customUploadFiles}
      listType="picture-card"
      onPreview={handlePreview}
      onRemove={(file) => onDelete(file)}
      beforeUpload={beforeUpload}
      fileList={fileList}
      directory={imageMode === UPLOAD_MODES.DIRECTORY}
      multiple={imageMode === UPLOAD_MODES.NORMAL ? isMultiple : false}
    >
      {fileList.length < imgsNumber && (
        <span>
          <UploadOutlined /> {t("upload")}
        </span>
      )}
    </Upload>
  );

  const uploadModes = isShowDirectory
    ? [UPLOAD_MODES.CROP, UPLOAD_MODES.NORMAL, UPLOAD_MODES.DIRECTORY]
    : [UPLOAD_MODES.CROP, UPLOAD_MODES.NORMAL];
  const radioItems = map(uploadModes, (type) => (
    <Radio key={type} value={type}>
      <span>{t(type)}</span>
    </Radio>
  ));

  return (
    <>
      <div style={{ paddingBottom: "10px" }}>
        <Radio.Group
          value={imageMode}
          onChange={(e) => setImageMode(e.target.value)}
        >
          {radioItems}
        </Radio.Group>
      </div>
      {imageMode === UPLOAD_MODES.CROP ? (
        <ImgCrop
          rotationSlider
          cropShape="rect"
          showGrid
          aspectSlider
          showReset
        >
          {uploadNode}
        </ImgCrop>
      ) : (
        uploadNode
      )}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image
          alt="example"
          style={{ maxWidth: "100%", height: "auto" }}
          src={previewImage}
          width={800}
          height={600}
          layout="responsive"
        />
      </Modal>
      {contextHolder}
    </>
  );
};

export default memo(UploadFiles);
