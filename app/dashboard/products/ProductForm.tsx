'use client'
import {useEffect, useState} from "react";
import {Button, Col, Flex, Form, Input, InputNumber, Row, Space, Spin, Switch, TreeSelect} from "antd";
import {useRouter} from "next/navigation";

import {Category, FileUpload, Product} from "@/app/lib/definitions";
import {CURRENCY_LIST, ROUTE_PATH} from "@/app/lib/constant";
import {fetchCategories} from "@/app/lib/service/categoryService";
import CustomEditor from "@/app/components/custom-editor";
import UploadFiles from "@/app/components/upload-files";
import {createUpdateProduct, fetchProductDetail} from "@/app/lib/service/productService";
import Select, {DefaultOptionType} from "antd/es/select";

interface ProductFormProps {
    params?: {
        id: string
    }
}

const ProductForm = ({ params }: ProductFormProps) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Item } = Form;
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [state, setState] = useState({
        loading: false,
        product: {} as Product,
        editorContent: ''
    })

    useEffect(() => {
        fetchCategories().then((data) => {
            setCategories(data as Category[]);
        });
    }, []);

    useEffect(() => {
        if (params?.id) {
            setState(prevState => ({ ...prevState, loading: true }));
            fetchProductDetail(params.id).then(product => {
                const newProduct = {
                    ...product,
                    category_id: product.category?.id,
                }
                form.setFieldsValue(newProduct);
                setState(prevState => ({
                    ...prevState,
                    product: newProduct,
                    editorContent: product.content || ''
                }));
            }).finally(() => {
                setState(prevState => ({ ...prevState, loading: false }));
            });
        }
    }, [params?.id])

    const onSubmitForm = async (values: Product) => {
        let sendData = { ...values }
        if (params?.id) {
            sendData = {
                ...sendData,
                id: params.id
            }
        }
        
        const res = await createUpdateProduct(sendData);
        if(res?.id) {
            form.resetFields();
            router.push(ROUTE_PATH.DASHBOARD_PRODUCTS);
        }
    }

    const onCancel = () => {
        form.resetFields();
        router.back();
    }

    return (<>
        <div className="cruproduct-page">
            <Spin spinning={state.loading} tip="Loading...">

                <Form layout="vertical"
                    name='CUProductForm'
                    form={form}
                    onFinish={onSubmitForm}
                    className="form-wrap"
                    initialValues={{ currency_code: CURRENCY_LIST[0].value }}
                >
                    <Item
                        name='images'
                        label='Images:'>
                        <UploadFiles
                            files={state.product.images || []}
                            onChangeFile={(files: FileUpload[]) => {
                                form.setFieldsValue({ images: files });
                            }}
                        />
                    </Item>
                    <Row gutter={48}>
                        <Col span={24}>
                            <Item
                                name="name"
                                label="Product name:"
                                rules={[{ required: true, message: 'Please enter product name' }]}
                            >
                                <Input placeholder="Product name" />
                            </Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Item
                                name='category_id'
                                label='Category:'
                                rules={[{ required: true, message: 'Please select the category' }]}
                            >
                                <TreeSelect
                                    treeData={categories as DefaultOptionType[]}
                                />
                            </Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Space.Compact block>
                                <Item
                                    name="price"
                                    label='Price:'
                                    style={{ width: '70%' }}
                                >
                                    <InputNumber
                                        width={'100%'} min={1}
                                        max={100000000}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Item>
                                <Item
                                    name="currency_code"
                                    label='Currency:'
                                    style={{ width: '30%' }}
                                >
                                    <Select
                                        options={CURRENCY_LIST}
                                    />
                                </Item>
                            </Space.Compact>

                        </Col>
                    </Row>
                    <Row gutter={48}>
                        <Col xs={24} md={12}>
                            <Item
                                name="link"
                                label="Link:"
                            >
                                <Input placeholder="Link mua hang" />
                            </Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Item
                                name="is_home"
                                label="Show on home page:"
                            >
                                <Switch />
                            </Item>
                        </Col>
                    </Row>
                    <Item
                        name="description"
                        label="Description:"
                    >
                        <TextArea rows={4} placeholder="Description" />
                    </Item>
                    <Item
                        name='content'
                        label='Pattern text'
                    >
                        <CustomEditor
                            initialData={state.editorContent}
                            onBlur={(_, editor) => {
                                const content = editor.getData();
                                form.setFieldsValue({ content });
                                setState(prevState => ({ ...prevState, editorContent: content }));
                            }} />
                    </Item>
                    <Flex justify="center" gap={10} wrap="wrap">
                        <Button
                            className="btn-form"
                            type="primary"
                            htmlType="submit"
                            loading={state.loading}
                            disabled={state.loading}
                        >
                            Submit
                        </Button>
                        <Button className="btn-form" onClick={onCancel}>Cancel</Button>
                    </Flex>
                </Form>
            </Spin>
        </div>
    </>)
}

export default ProductForm;
