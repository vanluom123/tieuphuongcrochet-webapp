'use client'
import { useEffect, useState } from "react";
import { Col, Flex, Form, Input, Modal, Row, Spin, TreeSelect } from "antd";
import { useTranslations } from "next-intl";
import { DefaultOptionType } from "antd/es/select";

import { Category, FileUpload, Pattern } from "@/app/lib/definitions";
import { TRANSLATION_STATUS } from "@/app/lib/constant";
import { fetchCategories } from "@/app/lib/service/categoryService";
import FreePatternStatus from "@/app/components/free-pattern-status";
import UploadFiles from "@/app/components/upload-files";
import { createUpdateFreePattern, fetchFreePatternDetail } from "@/app/lib/service/freePatternService";
import { UploadFile } from "antd/es/upload";
import { uploadMultipleImagesToServer } from "@/app/lib/utils";
import CustomEditor from "../custom-editor";

interface FreePatternFormProps {
    modalData: {
        open: boolean,
        id: string
    },
    setModalData: (modalData: { open: boolean, id: string }) => void;
    onRefreshData: () => void;
}

const initialState = {
    loading: false,
    pattern: {} as Pattern,
    editorContent: ''
}

const FreePatternFormModal = ({ modalData, setModalData, onRefreshData }: FreePatternFormProps) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Item } = Form;
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

        // Use Promise.all to handle concurrent uploads
         const categoryName = categories.find(ct => ct.key === sendData.category_id)?.name;
         const [uploadedImages, uploadedFiles] = await Promise.all([
             uploadMultipleImagesToServer(
                 sendData.images,
                 state.pattern.images,
                 'free-pattern',
                 categoryName),
             uploadMultipleImagesToServer(
                 sendData.files,
                 state.pattern.files,
                 'free-pattern',
                 categoryName)
         ]);

        sendData.images = uploadedImages;
        sendData.files = uploadedFiles;

        const res = await createUpdateFreePattern(sendData);
        if (res.success) {
            onHandleCancel();
            onRefreshData();
        } else {
            setState(prevState => ({ ...prevState, loading: false }));
        }
    }

    const onHandleCancel = () => {
        form.resetFields();
        setState({
            ...initialState,
            pattern: { name: '', src: '', images: [], files: [] }
        });
        setModalData({ open: false, id: '' });
    }

    const onHandleOk = () => {
        form.submit();
    }

    return (
        <Modal
            centered
            open={modalData.open}
            onOk={onHandleOk}
            onCancel={onHandleCancel}
            destroyOnClose={true}
            confirmLoading={state.loading}
        >
            <Spin spinning={state.loading} tip={t('loading')}>
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
                                onChangeFile={(files: UploadFile[]) => {
                                    form.setFieldsValue({ images: files });
                                }}
                                isShowDirectory={false}
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
                                        // defaultValue={TRANSLATION_STATUS.NONE}
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
                                key="ckeditor-freepattern-form-use"  // Add unique key
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
            </Spin>
        </Modal>
    )
}

export default FreePatternFormModal;