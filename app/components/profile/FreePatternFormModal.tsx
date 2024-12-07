'use client'
import { useEffect, useState } from "react";
import { Col, Flex, Form, Input, Modal, Row, Spin, TreeSelect } from "antd";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Category, FileUpload, Pattern } from "@/app/lib/definitions";
import { ROUTE_PATH, TRANSLATION_STATUS } from "@/app/lib/constant";
import { fetchCategories } from "@/app/lib/service/categoryService";
import FreePatternStatus from "@/app/components/free-pattern-status";
import CustomEditor from "@/app/components/custom-editor";
import UploadFiles from "@/app/components/upload-files";
import { createUpdateFreePattern, fetchFreePatternDetail } from "@/app/lib/service/freePatternService";
import { DefaultOptionType } from "antd/es/select";

interface FreePatternFormProps {
    modalData: {
        open: boolean,
        id: string
    },
    setModalData: (modalData: { open: boolean, id: string }) => void
}

const initialState = {
    loading: false,
    pattern: {} as Pattern,
    editorContent: ''
}

const FreePatternFormModal = ({ modalData, setModalData }: FreePatternFormProps) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Item } = Form;
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (!modalData.open) {
            form.resetFields();
            setState(initialState);
        }
    }, [modalData.open, form]);

    useEffect(() => {
        fetchCategories().then((data) => {
            setCategories(data as Category[]);
        });
    }, []);

    useEffect(() => {
        if (modalData.id && modalData.open) {
            setState(prevState => ({ ...prevState, loading: true }));

            fetchFreePatternDetail(modalData.id).then(pattern => {
                const newPattern = {
                    ...pattern,
                    category_id: pattern.category?.id,
                    is_home: pattern.home,
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
    }, [modalData.id, modalData.open, form]);

    const t = useTranslations('FreePattern');

    const onSubmitForm = async (values: Pattern) => {
        setState(prevState => ({ ...prevState, loading: true }));
        let sendData = { ...values }
        if (modalData.id) {
            sendData = {
                ...sendData,
                id: modalData.id
            }
        }

        const res = await createUpdateFreePattern(sendData);
        if (res?.id) {
            form.resetFields();
            setState(initialState);
            router.push(ROUTE_PATH.DASHBOARD_FREE_PATTERNS);
        } else {
            setState(prevState => ({ ...prevState, loading: false }));
        }
    }

    const onHandleCancel = () => {
        form.resetFields();
        setState(initialState);
        setModalData({ open: false, id: '' });
    }

    const onHandleOk = () => {
        form.submit();
        setModalData({ open: false, id: '' });
    }

    return (<>
        <Spin spinning={state.loading} tip="Loading...">
            <Modal
                centered
                open={modalData.open}
                onOk={onHandleOk}
                onCancel={onHandleCancel}
                width='auto'
                destroyOnClose={true}
            >
                <div className="crupattern-page">
                    <Flex justify="center">
                        <h1>{modalData.id ? t('updatePattern') : t('createPattern')}</h1>
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
                        </Row>
                        <Row gutter={48}>
                            <Col xs={24} lg={12}>
                                <Item
                                    name="status"
                                    label={t('Fields.status')}
                                >
                                    <FreePatternStatus
                                        defaultValue={TRANSLATION_STATUS.NONE}
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
                                initialData={state.editorContent}
                                onBlur={(_, editor) => {
                                    const content = editor.getData();
                                    form.setFieldsValue({ content });
                                    setState(prevState => ({ ...prevState, editorContent: content }));
                                }}
                            />
                        </Item>
                    </Form>
                </div>
            </Modal>
        </Spin>
    </>)
}

export default FreePatternFormModal;