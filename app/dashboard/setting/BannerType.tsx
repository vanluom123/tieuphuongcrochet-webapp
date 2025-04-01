import { Alert, Button, Divider, Flex, Form, Input, Modal, Space, Typography } from "antd";
import React, { memo, useEffect, useState } from "react";
import { includes, map } from "lodash";
import { DataType, IBannerType, TBannerType } from "@/app/lib/definitions";
import { BANNER_TYPES_DEFAULT } from "@/app/lib/constant";
import DataTable from "@/app/components/data-table";
import '../../ui/bannerTypes.scss';
import { createUpdateBannerType, deleteBannerType } from "@/app/lib/service/settingService";

interface ModalForm {
	open: boolean;
	id: React.Key;
	name?: TBannerType;
}

interface TypeBannerModalProps {
	openCUModal: ModalForm;
	setOpenCUModal: (value: ModalForm) => void;
	onRefresh: () => void;
}

const CUTypeModal = ({ openCUModal, setOpenCUModal, onRefresh }: TypeBannerModalProps) => {
	const [form] = Form.useForm();
	useEffect(() => {
		if (openCUModal.id) {
			const formData: IBannerType = {
				name: openCUModal.name || '',
			}
			form.setFieldsValue(formData);
		}
	}, [form, openCUModal.name,openCUModal.id]);

	const onSubmit = () => {
		form.validateFields().then(async (values: IBannerType) => {
			const sendData = openCUModal.id ? { ...values, id: openCUModal.id } : values;
			await createUpdateBannerType(sendData);
			setOpenCUModal({ open: false, id: '' });
			form.resetFields();
			onRefresh();
		}).catch((errorInfo: any) => {
		});
	}

	const oncancel = () => {
		setOpenCUModal({ open: false, id: '', name: '' });
		form.resetFields()
	}

	const validateName = (name: any) => {
		if (includes(BANNER_TYPES_DEFAULT, name)) {
			return Promise.resolve();
		}
		return Promise.reject(new Error('Vui lòng nhập tên thuộc một trong các tên bên trên!'));
	}

	return (
		<Modal
			title={openCUModal.id ? 'Cập nhật loại banner' : 'Tạo loại banner mới'}
			open={openCUModal.open}
			onOk={onSubmit}
			onCancel={oncancel}
			okText='Lưu'
			cancelText='Hủy'>
			<Space direction='vertical'>
				<Alert showIcon message='Vui lòng nhập tên thuộc một trong các tên bên dưới!' type='warning'
					description={
						<Space wrap>
							{map(BANNER_TYPES_DEFAULT, (b, index) => {
								if (index === BANNER_TYPES_DEFAULT.length - 1) {
									return <span key={`btype_${index}`}>{b}</span>
								}
								return <>
									<span key={`btype_${index}`}>{b}<Divider type="vertical" /></span>
								</>
							})}
						</Space>}
				/>
				<Form name='CUTypeForm'
					layout="vertical"
					form={form}
				>
					<Form.Item
						name='name'
						label='Tên:'
						rules={[{ required: true, message: 'Vui lòng nhập tên' },
						{
							validator: (_, value) => validateName(value)
						}
						]}
					>
						<Input placeholder="Nhập tên:" />
					</Form.Item>
				</Form>
			</Space>
		</Modal>
	)
}

interface BannerTypeProps {
	bannerTypes: DataType[];
	onRefresh: () => void;
	loading: boolean;
}

const BannerType = ({ bannerTypes, onRefresh, loading }: BannerTypeProps) => {
	const [openCUModal, setOpenCUModal] = useState<ModalForm>({ open: false, id: '' });
	const { Title } = Typography;

	const onDeleteRecord = async (id: React.Key) => {
		await deleteBannerType(id as string);
		onRefresh();
	};

	const onEditRecord = (id: React.Key, values: IBannerType) => {
		setOpenCUModal({ open: true, id, name: values.name });
	}

	return (
		<>
			<div className="banner-type-wrapper">
				<Title level={2} className="align-center">Loại Banner</Title>
				<Flex justify="flex-end">
					<Button
						danger
						className="banner-type__create btn-border"
						onClick={() => setOpenCUModal({ open: true, id: '' })}
					>
						Tạo mới
					</Button>
				</Flex>
				<DataTable
					loading={loading}
					dataSource={bannerTypes}
					onDeleteRecord={onDeleteRecord}
					onEditRecord={onEditRecord} />
			</div>
			{openCUModal.open && <CUTypeModal
			 	openCUModal={openCUModal}
			  	setOpenCUModal={setOpenCUModal}
				onRefresh={onRefresh}
			 />}
		</>
	)
}

export default memo(BannerType);