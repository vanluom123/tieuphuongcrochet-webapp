import { Button, Upload } from "antd"
import { useTranslations } from "next-intl";
import { notification } from "@/app/lib/notify";
import ImgCrop from "antd-img-crop";
import { uploadImageToR2 } from "@/app/lib/service/r2Service";
import { useState } from "react";


interface SingleUploadProps {
    onUpload: (file: string) => void;
    className?: string;
    icon?: React.ReactNode;
    isCrop?: boolean;
    page: string;
}

const SingleUpload = ({ onUpload, className, icon, isCrop = false, page }: SingleUploadProps) => {
    const t = useTranslations("Profile");
    let avatarUrl = '';
    const [loading, setLoading] = useState(false);
    const handleUpload = async (file: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('files', file);

            const res = await uploadImageToR2(file, page);
            avatarUrl = res[0].fileContent;
        } catch (error) {
            notification.error({
                message: t('Failed to upload avatar')
            });
        } finally {
            onUpload(avatarUrl);
            setLoading(false);
        }
    }

    const uploadNode = (
        <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleUpload}
            className={className}
        >
            <Button type="primary" shape='circle' icon={icon} loading={loading}/>
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