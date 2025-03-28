import { Button, Col, ColorPicker, Form, Input, Row, Select, Space, Switch } from "antd";
import { PlusOutlined } from '@ant-design/icons';


import { map } from "lodash";
import { memo, useEffect } from "react";
import UploadFiles from "@/app/components/upload-files";
import { FileUpload, Banner, DataType } from "@/app/lib/definitions";
import { notification } from "antd";
import { uploadImageToServer } from "@/app/lib/utils";


export interface EdittingBanner {
	isEditting: boolean,
	index: number,
	image: FileUpload[],
	banner: Banner;
}

export const initialEdittingBanner: EdittingBanner = {
	isEditting: false,
	index: -1,
	image: [] as FileUpload[],
	banner: {} as Banner,
}

interface BannerItemProps {
	bannersList: Banner[];
	SetBannersList: (value: Banner[]) => void;
	edittingBanner: EdittingBanner
	setEdittingBanner: (value: EdittingBanner) => void;
	setIsUpdatedBList: (value: boolean) => void;
	bannerTypes: DataType[];
	onRefresh: () => void;
}

const BannerForm = ({
	bannerTypes,
	bannersList,
	edittingBanner,
	setEdittingBanner,
	SetBannersList,
	setIsUpdatedBList,
	onRefresh
}: BannerItemProps) => {
	const [form] = Form.useForm();
	const { Item } = Form;


	useEffect(() => {
		if (edittingBanner.isEditting) {
			const { banner, image } = edittingBanner;
			form.setFieldsValue({
				title: banner.title,
				content: banner.content,
				url: banner.url,
				bannerTypeId: banner.bannerTypeId,
				bannerImage: image,
				active: banner.active,
				textColor: banner.textColor
			})
		}
	}, [edittingBanner, form]);

	const onAddBanner = async (values: any) => {
		const { title, content, url, bannerImage, bannerTypeId, active, textColor } = values;

		let fileContent = bannerImage[0]?.fileContent || bannerImage[0]?.url || '';
		let fileName = bannerImage[0]?.fileName || bannerImage[0]?.name || '';

		if (bannerImage[0]?.originFileObj) {
			const uploadedFiles = await uploadImageToServer(bannerImage, []);
			if (!uploadedFiles || uploadedFiles.length === 0) {
				notification.error({ message: 'Error', description: 'Failed to upload image' });
				return;
			}
			fileContent = uploadedFiles[0].fileContent;
			fileName = uploadedFiles[0].fileName;
		}

		const banner: Banner = {
			title,
			content,
			url,
			bannerTypeId,
			active,
			textColor: typeof textColor === 'string' ? textColor : textColor?.toHexString(),
			fileContent,
			fileName
		}

		console.log('filename %s --- filecontent %s', fileName, fileContent)

		let tempBanners = [...bannersList];
		if (edittingBanner.isEditting) {
			tempBanners.splice(edittingBanner.index, 1, banner);

			setEdittingBanner(initialEdittingBanner);
		} else {
			tempBanners = [
				...tempBanners,
				banner
			]
		}
		console.log('tempbanner: ', tempBanners)
		setIsUpdatedBList(true);
		SetBannersList(tempBanners);
		form.resetFields();
		onRefresh();
	};

	const onCancel = () => {
		if (edittingBanner.isEditting) {
			setEdittingBanner(initialEdittingBanner)
		}
		form.resetFields();
	}

	return (
		<Form name="bannerItemForm"
			layout="vertical"
			onFinish={onAddBanner}
			form={form}
			initialValues={{
				textColor: '#FFFFFF',
				active: true,
				bannerTypeId: '',
				bannerImage: [],
				title: '',
				content: '',
				url: ''
			}}
		>
			<Row gutter={[30, 30]}>
				<Col xs={24} md={10}>
					<Item
						name='bannerImage'
						label='Banner Image (16x9):'
						rules={[
							{ required: true, message: 'Please upload banner image' }
						]}
					>
						<UploadFiles
							files={edittingBanner.image}
							isMultiple={false}
							imgsNumber={1}
							onChangeFile={(files: FileUpload[]) => {
								form.setFieldsValue({ bannerImage: files });
							}}
							isShowDirectory={false}
						/>
					</Item>
				</Col>
				<Col xs={24} md={7}>
					<Item name='active' label='Active'>
						<Switch />
					</Item>
				</Col>
				<Col xs={24} md={7}>
					<Item name='textColor' label='Pick a color for title & content:' >
						<ColorPicker showText />
					</Item>
				</Col>
			</Row>

			<Row gutter={[30, 30]}>
				<Col xs={24} md={12}>
					<Item name='bannerTypeId'
						label='Photo type:'
						rules={[
							{ required: true, message: 'Please select the banner type' }
						]}
					>
						<Select
							options={map(bannerTypes, (bt: { name: any; key: any; }) => ({
								label: bt.name,
								value: bt.key
							}))}
							placeholder="Select the photo type" />
					</Item>
				</Col>
				<Col xs={24} md={12}>
					<Item name='title' label='Title' >
						<Input placeholder="Input the title:" />
					</Item>
				</Col>
			</Row>
			<Row gutter={[30, 30]}>
				<Col xs={24} md={12}>
					<Item name='url' label='Link:' >
						<Input placeholder="Input the link:" />
					</Item>
				</Col>
				<Col xs={24} md={12}>
					<Item name='content' label='Content:' >
						<Input placeholder="Input the content:" />
					</Item>
				</Col>
			</Row>

			<div className="align-center">
				<Space>
					<Button
						danger
						htmlType="submit"
						className="btn-border"
						icon={<PlusOutlined />}
					>
						{edittingBanner.isEditting ? 'Update' : 'Add'}
					</Button>
					<Button
						className="btn-form btn-border"
						onClick={onCancel}>Cancel</Button>
				</Space>
			</div>
		</Form >
	)
}

export default memo(BannerForm);