import { memo, useEffect, useState } from "react";
import ImgCrop from "antd-img-crop"
import { filter, map } from "lodash";
import { UploadOutlined } from '@ant-design/icons';
import { Modal, Radio, Spin, Upload, UploadFile, UploadProps, message } from "antd"

import { FileUpload, UPLOAD_MODES } from "@/app/lib/definitions";
import { UploadMode } from "@/app/lib/definitions";
import { getBase64, showConfirmDelete } from "@/app/lib/utils";
import uploadFile from "@/app/lib/service/uploadFilesSevice";
import { notification } from "@/app/lib/notify";
import Image from "next/image";

interface UploadFilesProps extends UploadProps {
	onChangeFile: (files: FileUpload[]) => void;
	files?: FileUpload[];
	imgsNumber?: number;
	isMultiple?: boolean;
	isShowDirectory?: boolean;
	defaultImageMode?: 'crop' | 'normal';
};

const UploadFiles = ({ defaultImageMode = 'crop', onChangeFile, files, imgsNumber = 20, isMultiple = true, isShowDirectory = true }: UploadFilesProps) => {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState<any[]>([]);
	const [imageMode, setImageMode] = useState<UploadMode>(defaultImageMode);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (files && files.length > 0) {
			setFileList(files);
		}
	}, [files])

	// Add this effect near your other useEffects
	useEffect(() => {
		if (fileList.length > 0) {
			onChangeFile(fileList);
		}
	}, [fileList, onChangeFile]);

	// Then simplify updateImages to just update the state
	const updateImages = (file: FileUpload) => {
		setFileList((prevState) => [...prevState, file]);
	};

	const handleCancel = () => setPreviewOpen(false);

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as File);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
	};

	const getNewFile = (file: File) => {
		const name = file.name.split('.');
		const ext = name[name.length - 1];
		const newName = `${name[0]}_${new Date().getTime()}.${ext}`;

		const blob = file.slice(0, file.size);
		return new File([blob], newName, { type: file.type });
	}

	const customUploadFiles = async ({ file, onSuccess, onError }: any) => {
		const isLimit5Mb = file?.size / 1024 / 1024 < 5;
		if (!isLimit5Mb) {
			onError('fail');
			notification.error({ message: 'Error', description: 'Allowed maxium size is 5Mb' });
			return;
		}

		const formData = new FormData();
		setLoading(true);

		console.log('file', file);

		formData.append('files', getNewFile(file));
		const res: FileUpload[] = await uploadFile.upload(formData);

		if (res) {
			setLoading(false);
		}

		if (res.length > 0) {
			const newFiles = {
				...res[0],
				url: res[0].fileContent
			};

			updateImages(newFiles);
			onSuccess('ok');
			notification.success({ message: 'Successful!', description: 'Upload file successfully!' });
		} else {
			onError('fail');
			notification.error({ message: '!Error', description: 'Allowed maxium size is 5Mb' });
		}
	};

	const onDelete = async (file: UploadFile) => {
		const res: string[] = await uploadFile.delete([file?.fileName as string]);
		if (res.length > 0) {
			notification.error({ message: 'Error!', description: 'Delete file failed!' });
			return;
		}
		notification.success({ message: 'Successfully!', description: 'Delete successfully!' });

		const newFileList = filter(fileList, f => f.url !== file.url);

		setFileList(newFileList);
		onChangeFile(newFileList);
	}


	const beforeUpload = (file: File) => {
		const isLt2M = file.size / 1024 / 1024 < 5;
		if (!isLt2M) {
			message.error('Image must smaller than 5Mb!');
		}
		return isLt2M;
	}

	const uploadNode = (
		<Upload
			accept="image/png,image/jpeg,image/jpg,.pdf,.doc,.docx"
			customRequest={customUploadFiles}
			listType="picture-card"
			onPreview={handlePreview}
			onRemove={file => showConfirmDelete(file, () => onDelete(file))}
			beforeUpload={beforeUpload}
			fileList={fileList}
			directory={imageMode === UPLOAD_MODES.DIRECTORY}
			multiple={imageMode === UPLOAD_MODES.DIRECTORY ? false : isMultiple}
		>
			{fileList.length < imgsNumber &&
				<Spin spinning={loading}><UploadOutlined /> Upload</Spin>
			}
		</Upload>
	);

	const uploadModes = isShowDirectory ?
		[UPLOAD_MODES.CROP, UPLOAD_MODES.NORMAL, UPLOAD_MODES.DIRECTORY] :
		[UPLOAD_MODES.CROP, UPLOAD_MODES.NORMAL]
	const radioItems = map(uploadModes, type => (
		<Radio key={type} value={type}>
			<span style={{ textTransform: 'capitalize' }}>{type}</span>
		</Radio>
	));

	return (
		<>
			<div style={{ paddingBottom: '10px' }}>
				<Radio.Group value={imageMode} onChange={(e) => setImageMode(e.target.value)}>
					{radioItems}
				</Radio.Group>
			</div>
			{
				imageMode === UPLOAD_MODES.CROP ?
					<ImgCrop
						rotationSlider
						cropShape='rect'
						showGrid
						aspectSlider
						showReset
					>
						{uploadNode}
					</ImgCrop> : uploadNode
			}
			<Modal
				open={previewOpen}
				title={previewTitle}
				footer={null}
				onCancel={handleCancel}
			>
				<Image alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</>
	)
}

export default memo(UploadFiles);