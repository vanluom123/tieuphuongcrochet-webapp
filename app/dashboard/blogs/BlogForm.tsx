'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Form, Input, Button, Flex, Row, Col, Switch, Spin } from "antd";

import UploadFiles from "@/app/components/upload-files";
import { FileUpload, Post } from "@/app/lib/definitions";
import { createUpdatePost, fetchPostDetail } from "@/app/lib/service/blogsService";
import { uploadMultipleImagesToServer } from "@/app/lib/utils";
import { ROUTE_PATH } from "@/app/lib/constant";

const CustomEditor = dynamic(
    () => import('@/app/components/custom-editor'),
    { ssr: false }
);

interface BlogFormProps {
    params?: {
        id: string
    }
}
const initialState = {
    loading: false,
    post: {} as Post,
    editorContent: ''
}

const BlogForm = ({ params }: BlogFormProps) => {
    const [form] = Form.useForm();
    const { Item } = Form;
    const router = useRouter();

    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (params?.id) {
            setState(prevState => ({ ...prevState, loading: true }));
            fetchPostDetail(params.id).then((data) => {
                const newPost = {
                    ...data
                }
                form.setFieldsValue(newPost);
                setState(prevState => ({
                    ...prevState,
                    post: newPost,
                    editorContent: newPost.content || ''
                }));
            }).finally(() => {
                setState(prevState => ({ ...prevState, loading: false }));
            });
        }
    }, [params?.id, form]);

    useEffect(() => {
        if (params?.id && state.post?.title) {
            form.setFieldsValue(state.post);
        }
    }, [state.post, form, params?.id]);

    const onSubmitForm = async (values: Post) => {
        setState(prevState => ({ ...prevState, loading: true }));
        let sendData = { ...values }
        if (params?.id) {
            sendData = {
                ...sendData,
                id: params.id as string
            }
        }

        // Handle upload, delete images
        sendData.files = await uploadMultipleImagesToServer(
            sendData.files,
            state.post.files,
            'blogs',
        )

        createUpdatePost(sendData).then((res) => {
            if (res.success) {
                form.resetFields();
                router.push(ROUTE_PATH.DASHBOARD_POSTS);
            }
        }).finally(() => {
            setState(prevState => ({ ...prevState, loading: false }));
        });
    }

    const onCancel = () => {
        form.resetFields();
        router.back();
    }

    return (<>
        <div className="cupost-page">
            <Spin spinning={state.loading} tip="Loading...">
                <Form layout="vertical"
                    name='CUPostForm'
                    form={form}
                    onFinish={onSubmitForm}
                    className="form-wrap"
                >
                    <Row>
                        <Col xs={24} md={12}>
                            <Item
                                name='files'
                                label='Image:'>
                                <UploadFiles
                                    isShowDirectory={false}
                                    isMultiple={false}
                                    files={state.post?.files || []}
                                    imgsNumber={1}
                                    onChangeFile={(files: FileUpload[]) => {
                                        form.setFieldsValue({ files: files });
                                    }}
                                />
                            </Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Item
                                name='is_home'
                                label='Show on home'>
                                <Switch />
                            </Item>
                        </Col>
                    </Row>
                    <Item
                        name="title"
                        label="Post title:"
                        rules={[{ required: true, message: 'Please enter post title' }]}
                    >
                        <Input placeholder="Post title" />
                    </Item>
                    <Item
                        name='content'
                        label='Pattern text'
                    >
                        <CustomEditor
                            key='editor-form-blog'
                            initialData={state.editorContent}
                            onBlur={(_, editor) => {
                                const content = editor.getData();
                                form.setFieldsValue({ content });
                                setState(prevState => ({ ...prevState, editorContent: content }));
                            }} 
                        />
                    </Item>
                    <Flex justify="center" gap={10} wrap="wrap">
                        <Button
                            className="btn-form"
                            type="primary"
                            htmlType="submit"
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

export default BlogForm;