import uploadFile from "@/app/lib/service/uploadFilesSevice";
import { Button, Upload } from "antd"
import { useTranslations } from "next-intl";
import { notification } from "@/app/lib/notify";
import ImgCrop from "antd-img-crop";


interface SingleUploadProps {
    onUpload: (file: string) => void;
    className?: string;
    icon?: React.ReactNode;
    isCrop?: boolean;
}

const SingleUpload = ({ onUpload, className, icon, isCrop = false }: SingleUploadProps) => {
    const t = useTranslations("Profile");
    let avatarUrl = '';
    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('files', file);

            const res = await uploadFile.upload(formData);
            console.log('SingleUpload file', res);

            if (res && res.length > 0) {
                avatarUrl = res[0].fileContent;
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            notification.error({
                message: t('Failed to upload avatar')
            });
        } finally {
            onUpload(avatarUrl);
        }
    }

    const uploadNode = (
        <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleUpload}
            className={className}
        >
            <Button type="primary" shape='circle' icon={icon} />
        </Upload>
    )

    return (
        isCrop ?
            <ImgCrop rotationSlider>
                {uploadNode}
            </ImgCrop>
            : uploadNode
    )
}

export default SingleUpload;