'use client'
import { useEffect, useState } from "react";
import { Button, Col, Flex, Form, Input, Row, Spin, Switch, TreeSelect } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { DefaultOptionType } from "antd/es/select";

import { Category, CUResponse, FileUpload, Pattern } from "@/app/lib/definitions";
import { ROUTE_PATH, TRANSLATION_STATUS } from "@/app/lib/constant";
import { fetchCategories } from "@/app/lib/service/categoryService";
import FreePatternStatus from "@/app/components/free-pattern-status";
import UploadFiles from "@/app/components/upload-files";
import { uploadImageToServer } from "@/app/lib/utils";
import { createUpdateFreePattern, fetchFreePatternDetail } from "@/app/lib/service/freePatternService";

const CustomEditor = dynamic(
    () => import('@/app/components/custom-editor'),
    { ssr: false }
);

interface FreePatternFormProps {
    params?: {
        id: string
    }
}
const initialState = {
    loading: false,
    pattern: {} as Pattern,
    editorContent: ''
}

const FreePatternForm = ({ params }: FreePatternFormProps) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Item } = Form;
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        fetchCategories().then((data) => {
            setCategories(data as Category[]);
        });
    }, []);

    useEffect(() => {
        if (params?.id) {
            setState(prevState => ({ ...prevState, loading: true }));

            fetchFreePatternDetail(params.id).then(pattern => {
                const newPattern = {
                    ...pattern,
                    category_id: pattern.category?.id,
                    status: pattern.status || TRANSLATION_STATUS.NONE
                }
                form.setFieldsValue(newPattern);
                setState(prevState => ({
                    ...prevState,
                    pattern,
                    editorContent: pattern.content || ''
                }));
            }).finally(() => {
                setState(prevState => ({ ...prevState, loading: false }));
            });
        }
    }, [params?.id, form]);

    const t = useTranslations('FreePattern');

    const onSubmitForm = async (values: Pattern) => {
        setState(prevState => ({ ...prevState, loading: true }));
        let sendData = { ...values }
        if (params?.id) {
            sendData = {
                ...sendData,
                id: params.id
            }
        }

        // Use Promise.all to handle concurrent uploads
        const [uploadedImages, uploadedFiles] = await Promise.all([
            uploadImageToServer(sendData.images, state.pattern.images),
            uploadImageToServer(sendData.files, state.pattern.files)
        ]);

        sendData.images = uploadedImages;
        sendData.files = uploadedFiles;
        const res: CUResponse = await createUpdateFreePattern(sendData);
        if (res?.success) {
            form.resetFields();
            setState({
                ...initialState,
                pattern: { name: '', src: '', images: [], files: [] }
            });
            router.push(ROUTE_PATH.DASHBOARD_FREE_PATTERNS);
        } else {
            setState(prevState => ({ ...prevState, loading: false }));
        }
    }

    const onCancel = () => {
        form.resetFields();
        router.back();
    }

    return (<>
        <Spin spinning={state.loading} tip="Loading...">
            <div className="crupattern-page">
                <Flex justify="center">
                    <h1>{params?.id ? t('updatePattern') : t('createPattern')}</h1>
                </Flex>
                <Form layout="vertical"
                    name='cUPatternForm'
                    form={form}
                    onFinish={onSubmitForm}
                    className="form-wrap"
                >
                    <Item
                        name='images'
                        label={t('Fields.images')}
                        rules={[{ required: true, message: t('Fields.error_msg_required_images') }]}
                    >
                        <UploadFiles
                            files={state.pattern.images || []}
                            onChangeFile={(files: FileUpload[]) => {
                                form.setFieldsValue({ images: files });
                            }}
                        />
                    </Item>
                    <Row gutter={48}>
                        <Col xs={24} md={12}>
                            <Item
                                name="name"
                                label={t('Fields.name')}
                                rules={[{ required: true, message: t('Fields.error_msg_required_name') }]}
                            >
                                <Input placeholder={t('Fields.name')} />
                            </Item>
                        </Col>
                        <Col md={12} xs={24}>
                            <Item
                                name="author"
                                label={t('Fields.author')}
                                rules={[{ required: true, message: t('Fields.error_msg_required_author') }]}
                            >
                                <Input placeholder={t('Fields.author')} />
                            </Item>
                        </Col>
                    </Row>

                    <Row gutter={48}>
                        <Col md={12} xs={24}>
                            <Item
                                name='category_id'
                                label={t('Fields.category')}
                                rules={[{ required: true, message: t('Fields.error_msg_required_category') }]}
                            >
                                <TreeSelect
                                    treeData={categories as DefaultOptionType[]}
                                />
                            </Item>
                        </Col>

                        <Col md={12} xs={24}>
                            <Item
                                name="is_home"
                                label={t('Fields.is_home')}
                            >
                                <Switch />
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={48}>
                        <Col xs={24} lg={12}>
                            <Item
                                name="status"
                                label={t('Fields.status')}
                            >
                                <FreePatternStatus
                                    value={state.pattern.status}
                                    options={[
                                        {
                                            label: 'NONE',
                                            value: 'NONE',
                                        },
                                        {
                                            label: 'PENDING',
                                            value: 'PENDING',
                                        },
                                        {
                                            label: "SUCCESS",
                                            value: 'SUCCESS',
                                        },
                                    ]}
                                />
                            </Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Item
                                name="link"
                                label={t('Fields.link')}
                            >
                                <Input placeholder={t('Fields.link')} />
                            </Item>
                        </Col>
                    </Row>

                    <Item
                        name="description"
                        label={t('Fields.description')}
                    >
                        <TextArea rows={4} placeholder={t('Fields.description')} />
                    </Item>
                    <Item
                        name='files'
                        label={t('Fields.files')}>
                        <UploadFiles
                            files={state.pattern.files || []}
                            onChangeFile={(files: FileUpload[]) => {
                                form.setFieldsValue({ files: files });
                            }}
                            defaultImageMode="normal"
                        />
                    </Item>
                    <Item
                        name='content'
                        label={t('Fields.content')}
                    >
                        <CustomEditor
                            key='editor-form-free-pattern'
                            initialData={state.editorContent}
                            onBlur={(_, editor) => {
                                const content = editor.getData();
                                form.setFieldsValue({ content });
                                setState(prevState => ({ ...prevState, editorContent: content }));
                            }}
                        />
                    </Item>
                    <Flex justify="center" gap={10} wrap="wrap">
                        <Button className="btn-form" type="primary" htmlType="submit" disabled={state.loading}>
                            {t('Btn.submit')}
                        </Button>
                        <Button className="btn-form" onClick={onCancel} disabled={state.loading}>{t('Btn.cancel')}</Button>
                    </Flex>
                </Form>
            </div>
        </Spin>
    </>)
}

export default FreePatternForm;