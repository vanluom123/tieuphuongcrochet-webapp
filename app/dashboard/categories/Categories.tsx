'use client'
import React, { useEffect, useState } from 'react';
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons';

import DataTable from '@/app/components/data-table';
import { Category, DataTableState, DataType } from '@/app/lib/definitions';
import { fetchCategories } from '@/app/lib/service/categoryService';
import SearchTable from '@/app/components/data-table/SearchTable';
import { Form, Checkbox, CheckboxProps, Button, Popconfirm, Modal, Input, Divider, List, Typography, CheckboxOptionType } from 'antd'; import { map } from 'lodash';

interface CUCategoryProps {
	categorySelected: DataType;
	setCategorySelected: Function;
	isModalOpen: boolean;
	setIsModalOpen: Function;
	categories: CheckboxOptionType[];
}

const CRUCategoryModal = ({ isModalOpen, setIsModalOpen, categorySelected, setCategorySelected, categories }: CUCategoryProps) => {
	const [form] = Form.useForm();
	const [childForm] = Form.useForm();
	const [checkedList, setCheckedList] = useState<string[]>([]);
	const CheckboxGroup = Checkbox.Group;

	const isEditing = Object.keys(categorySelected || {}).length > 0;
	const checkAll = categories.length === checkedList.length;
	const indeterminate = checkedList.length > 0 && checkedList.length < categories.length;

	useEffect(() => {
		if (isEditing) {
			const formData: Category = {
				name: categorySelected.name,
			}
			form.setFieldsValue(formData);
		}
	}, [categorySelected]);

	const handleOk = () => {
		form.validateFields()
			.then((values) => {

				let sendData: Category = {
					name: values.name,
				}

				if (isEditing) {
					sendData = {
						...sendData,
						id: categorySelected.key
					}
					// dispatch(categoryAction.update(sendData));
				}
				else {
					sendData = {
						...sendData,
						parentIds: checkedList
					};
					// createCategory(sendData);
				}
				handleCancel();
			})
			.catch((errorInfo) => {
				console.log(errorInfo);
			});
	};

	const handleCancel = () => {
		categorySelected && setCategorySelected({});
		childForm.resetFields();
		form.resetFields();
		setCheckedList([]);
		setIsModalOpen(false);
	};

	const onDelete = (id: string) => {
	}

	const onUpdateChildCategory = (index: string) => {
		childForm.validateFields()
			.then((values) => {
				//   dispatch(categoryAction.update({
				// 	id: index,
				// 	name: values[`children${index}`]
				//   } as Category));
			})

			.catch((errorInfo) => {
				console.log(errorInfo);
			});
	};


	const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
		setCheckedList(e.target.checked ? categories.map(category => category.value) : []);
	};

	const childActions = (key: string) => [
		<Button shape='circle' icon={<SaveOutlined />} onClick={() => onUpdateChildCategory(key)} />,
		<Popconfirm
			title="Sure to delete?"
			onConfirm={() => onDelete(key)}>
			<Button
				shape='circle'
				icon={<DeleteOutlined />}
			/>
		</Popconfirm>
	];


	const onChange = (list: string[]) => {
		setCheckedList(list);
	};

	return (
		<>
			<Modal
				title={isEditing ? 'Update the category' : 'Create a new category'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}>
				<Form layout="vertical"
					name='CUCategoryForm'
					form={form}
				>
					<Form.Item
						name="name"
						label="Category name "
						rules={[{ required: true, message: 'Please enter category name' }]}
					>
						<Input placeholder="Category name" />
					</Form.Item>

					{
						!isEditing ?
							// Form Creating
							<Form.Item
								name="parentIds"
								label="Parents"
							>
								<Checkbox
									indeterminate={indeterminate}
									onChange={onCheckAllChange}
									checked={checkAll}>
									Check all
								</Checkbox>
								<Divider />
								<CheckboxGroup
									options={categories}
									value={checkedList}
									onChange={onChange}
								/>
							</Form.Item> :

							/* Form editing */
							< Form.Item name='children' label='Children'>
								<List
									itemLayout="horizontal"
									dataSource={categorySelected?.children as { key: string, name: string }[]}
									renderItem={(item, index) => (
										<List.Item
											actions={childActions(item.key)}
										>
											<Typography.Text >[{index + 1}]</Typography.Text>
											<Form
												name='childrenForm'
												layout='inline'
												form={childForm}
												initialValues={{ [`children${item.key}`]: item.name }}
											>
												<Form.Item
													name={`children${item.key}`}
												>
													<Input placeholder="Child category" />
												</Form.Item>
											</Form>
										</List.Item>
									)}
								/>
							</Form.Item>}
				</Form>
			</Modal >
		</>
	);
};

const initialState: DataTableState = {
	loading: false,
	data: [],
	totalRecord: 0,
};

const CategoriesList = () => {
	const [state, setState] = useState(initialState);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [categorySelected, setCategorySelected] = useState({} as DataType);

	useEffect(() => {
		let isMounted = true;

		const loadCategories = async () => {
			setState({ ...state, loading: true });
			try {
				const data = await fetchCategories();
				if (isMounted) {
					setState(prevState => ({ ...prevState, data: data as DataType[], loading: false }));
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
				if (isMounted) {
					setState(prevState => ({ ...prevState, loading: false }));
				}
			}
		};

		loadCategories();

		return () => {
			isMounted = false;
		};
	}, []);

	const showModal = () => {
		setIsModalOpen(true);
	}

	const onEditRecord = (rd: React.Key, record: any) => {
		setCategorySelected(record);
		setIsModalOpen(true);
	}

	const onDeleteRecord = (key: React.Key) => {
	}

	return (
		<>
			<div className='category-page'>
				<SearchTable onAddNew={showModal} />
				<div className='admin-table'>
					<DataTable
						loading={state.loading}
						dataSource={state.data as DataType[]}
						onDeleteRecord={onDeleteRecord}
						onEditRecord={onEditRecord}
					/>
				</div>
			</div>
			<CRUCategoryModal
				categorySelected={categorySelected}
				setCategorySelected={setCategorySelected}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				categories={map(state.data, (item: DataType) => ({ value: item.key, label: item.name })) as CheckboxOptionType[]}
			/>
		</>
	)
}

export default CategoriesList
