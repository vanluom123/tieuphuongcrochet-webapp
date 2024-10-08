'use client'
import { useEffect, useRef, useState } from "react";
import { Form, Input, TreeSelect, Button, Row, Col, Flex, Switch, Spin } from "antd";
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
    params?: {
        id: string
    }
}

const FreePatternForm = ({ params }: FreePatternFormProps) => {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { Item } = Form;
    const router = useRouter();
    const categories = useRef<Category[]>([]);

    const [state, setState] = useState({
        loading: false,
        pattern: {} as Pattern
    })

    useEffect(() => {
        fetchCategories().then((data) => {
            categories.current = data as Category[];
        });
    }, []);

    useEffect(() => {
        if (params?.id) {
            setState({ ...state, loading: true });

            fetchFreePatternDetail(params.id).then(pattern => {
                const newPattern = {
                    ...pattern,
                    category_id: pattern.category?.id,
                    is_home: pattern.home,
                    status: pattern.status || TRANSLATION_STATUS.NONE
                }
                form.setFieldsValue(newPattern);
                setState({...state, pattern})
            }).finally(() => {
                setState(prevState => ({ ...prevState, loading: false }));
            });
        }
    }, [params?.id])

    const t = useTranslations('FreePattern');

    const onSubmitForm = async (values: Pattern) => {
        let sendData = { ...values }
        if (params?.id) {
            sendData = {
                ...sendData,
                id: params.id
            }
        }

        console.log("sendData", sendData);

        const res = await createUpdateFreePattern(sendData);
        if(res?.id) {
            form.resetFields();
            router.push(ROUTE_PATH.DASHBOARD_FREE_PATTERNS);
        }
    }

    const onCancel = () => {
        form.resetFields();
        router.back();
    }

    return (<>
        <div className="crupattern-page">
            <Flex justify="center">
                <h1>{params?.id ? t('updatePattern') : t('createPattern')   }</h1>
            </Flex>
            <Spin spinning={state.loading} tip="Loading...">
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
                                    treeData={categories.current as DefaultOptionType[]}
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
                        />
                    </Item>
                    <Item
                        name='content'
                        label={t('Fields.content')}
                    >
                        <CustomEditor
                            initialData={state.pattern?.content || ''}
                            onBlur={(_, editor) => {
                                form.setFieldsValue({ content: editor.getData() })
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
            </Spin>
        </div>
    </>)
}

export default FreePatternForm;