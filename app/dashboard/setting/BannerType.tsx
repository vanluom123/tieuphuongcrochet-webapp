import { Alert, Button, Divider, Flex, Form, Input, Modal, Space } from "antd";
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
}

const CUTypeModal = ({ openCUModal, setOpenCUModal }: TypeBannerModalProps) => {
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
		}).catch((errorInfo: any) => {
			console.log('Failed:', errorInfo);
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
		return Promise.reject(new Error('Please enter a name belonging to 1 of the names above!'));
	}

	return (
		<Modal
			title={openCUModal.id ? 'Update the banner type' : 'Create a new banner type'}
			open={openCUModal.open}
			onOk={onSubmit}
			onCancel={oncancel}
			okText='Submit'>
			<Space direction='vertical'>
				<Alert showIcon message='Please enter a name belonging to 1 of the names below!' type='warning'
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
						label='Name:'
						rules={[{ required: true, message: 'Please enter the name' },
						{
							validator: (_, value) => validateName(value)
						}
						]}
					>
						<Input placeholder="Enter the name:" />
					</Form.Item>
				</Form>
			</Space>
		</Modal>
	)
}

const BannerType = ({ bannerTypes }: { bannerTypes: DataType[] }) => {
	const [openCUModal, setOpenCUModal] = useState<ModalForm>({ open: false, id: '' });

	const onDeleteRecord = async (id: React.Key) => {
		await deleteBannerType(id as string);
	};

	const onEditRecord = (id: React.Key, values: IBannerType) => {
		setOpenCUModal({ open: true, id, name: values.name });
	}

	return (
		<>
			<div className="banner-type-wrapper">
				<h2 className="align-center">Banner Types</h2>
				<Flex justify="flex-end">
					<Button
						danger
						className="banner-type__create btn-border"
						onClick={() => setOpenCUModal({ open: true, id: '' })}
					>
						Create
					</Button>
				</Flex>
				<DataTable
					loading={bannerTypes.length === 0}
					dataSource={bannerTypes}
					onDeleteRecord={onDeleteRecord}
					onEditRecord={onEditRecord} />
			</div>
			{openCUModal.open && <CUTypeModal openCUModal={openCUModal} setOpenCUModal={setOpenCUModal} />}
		</>
	)
}

export default memo(BannerType);