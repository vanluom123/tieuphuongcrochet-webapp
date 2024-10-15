'use client'
import CustomEditor from "@/app/components/custom-editor";
import UploadFiles from "@/app/components/upload-files";
import { FileUpload, Post } from "@/app/lib/definitions";
import { createUpdatePost, fetchPostDetail } from "@/app/lib/service/blogsService";
import { Form, Input, Button, Flex, Row, Col, Switch, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BlogFormProps {
    params?: {
        id: string
    }
}

const BlogForm = ({ params }: BlogFormProps) => {
    const [form] = Form.useForm();
    const { Item } = Form;
    const router = useRouter();

    const [state, setState] = useState({
        loading: false,
        post: {} as Post,
        editorContent: ''
    })

    useEffect(() => {
        if (params?.id) {
            setState({ ...state, loading: true });
            fetchPostDetail(params.id).then((data) => {
                const newPost = {
                    ...data
                }
                form.setFieldsValue(newPost);
                setState({
                    ...state,
                    post: newPost,
                    editorContent: newPost.content || ''
                });
            }).finally(() => {
                setState(prevState => ({ ...prevState, loading: false }));
            });
        }
    }, [params?.id]);

    useEffect(() => {
        if (params?.id && state.post?.title) {
            form.setFieldsValue(state.post);
        }
    }, [state.post]);

    const onSubmitForm = (values: Post) => {
        let sendData = { ...values }
        if (params?.id) {
            sendData = {
                ...sendData,
                id: params.id as string
            }
        }

        createUpdatePost(sendData).then((res) => {
            if (res?.id) {
                form.resetFields();
                router.back();
            }
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