'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Form, Input, Button, Flex, Row, Col, Switch, Spin, Select, Modal, List, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import UploadFiles from "@/app/components/upload-files";
import { FileUpload, Post } from "@/app/lib/definitions";
import { createUpdatePost, fetchPostDetail } from "@/app/lib/service/blogsService";
import { uploadMultipleImagesToServer } from "@/app/lib/utils";
import { ROUTE_PATH } from "@/app/lib/constant";
import {
    fetchBlogCategories,
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    BlogCategory,
} from "@/app/lib/service/blogCategoryService";

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
    const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
    const [categoryLoading, setCategoryLoading] = useState(false);

    const loadCategories = async () => {
        const categories = await fetchBlogCategories();
        setBlogCategories(categories);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (params?.id) {
            setState(prevState => ({ ...prevState, loading: true }));
            fetchPostDetail(params.id).then((data) => {
                const newPost = {
                    ...data,
                    blogCategoryId: data.blogCategory?.id
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

    const onSubmitForm = async (values: Post & { blogCategoryId?: string }) => {
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

    const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setCategoryLoading(true);
        try {
            const res = await createBlogCategory({ 
                name: newCategoryName,
                nameEn: newCategoryNameEn.trim() || undefined
            });
            if (res.success) {
                setNewCategoryName('');
                setNewCategoryNameEn('');
                await loadCategories();
            }
        } finally {
            setCategoryLoading(false);
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory || !editingCategory.name.trim()) return;
        setCategoryLoading(true);
        try {
            const res = await updateBlogCategory({
                id: editingCategory.id,
                name: editingCategory.name,
                nameEn: editingCategory.nameEn?.trim() || undefined
            });
            if (res.success) {
                setEditingCategory(null);
                await loadCategories();
            }
        } finally {
            setCategoryLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        await deleteBlogCategory(id);
        await loadCategories();
        // If deleted category was selected, clear it
        const currentCategoryId = form.getFieldValue('blogCategoryId');
        if (currentCategoryId === id) {
            form.setFieldsValue({ blogCategoryId: undefined });
        }
    };

    const categoryOptions = blogCategories.map(cat => ({
        label: cat.name,
        value: cat.id,
    }));

    return (<>
        <div className="cupost-page">
            <Spin spinning={state.loading} tip="Loading...">
                <Form layout="vertical"
                    name='CUPostForm'
                    form={form}
                    onFinish={onSubmitForm}
                    className="form-wrap"
                >
                    <Row gutter={16}>
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
                                label='Show on home'
                                valuePropName="checked"
                            >
                                <Switch />
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Item
                                name="title"
                                label="Post title:"
                                rules={[{ required: true, message: 'Please enter post title' }]}
                            >
                                <Input placeholder="Post title" />
                            </Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Flex gap={8} align="center" style={{ width: '100%' }}>
                                <Item
                                    name="blogCategoryId"
                                    label="Blog Category"
                                    style={{ flex: 1, marginBottom: 0 }}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Select category"
                                        options={categoryOptions}
                                    />
                                </Item>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setNewCategoryName('');
                                        setEditingCategory(null);
                                        setCategoryModalOpen(true);
                                    }}
                                />
                            </Flex>
                        </Col>
                    </Row>
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
                            page="blogs"
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

        {/* Category CRUD Modal */}
        <Modal
            title="Manage Blog Categories"
            open={categoryModalOpen}
            onCancel={() => {
                setCategoryModalOpen(false);
                setEditingCategory(null);
            }}
            footer={null}
        >
            <Flex vertical gap={12}>
                {editingCategory ? (
                    <Flex vertical gap={8} style={{ border: '1px solid #d9d9d9', padding: '12px', borderRadius: '6px', background: '#fafafa' }}>
                        <div style={{ fontWeight: 'bold' }}>Edit Category:</div>
                        <Input
                            placeholder="Edit category name (VI)"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        />
                        <Input
                            placeholder="Edit category name (EN)"
                            value={editingCategory.nameEn || ''}
                            onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                        />
                        <Flex gap={8} justify="end">
                            <Button size="small" onClick={() => setEditingCategory(null)}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                loading={categoryLoading}
                                onClick={handleUpdateCategory}
                            >
                                Save
                            </Button>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex vertical gap={8}>
                        <Input
                            placeholder="Enter new category name (VI)"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onPressEnter={handleAddCategory}
                        />
                        <Flex gap={8} align="center">
                            <Input
                                placeholder="Enter new category name (EN)"
                                value={newCategoryNameEn}
                                onChange={(e) => setNewCategoryNameEn(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                type="primary"
                                loading={categoryLoading}
                                onClick={handleAddCategory}
                            >
                                Add
                            </Button>
                        </Flex>
                    </Flex>
                )}
                <List
                    dataSource={blogCategories}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="edit"
                                    size="small"
                                    onClick={() => setEditingCategory(item)}
                                >
                                    Edit
                                </Button>,
                                <Popconfirm
                                    key="delete"
                                    title="Delete this category?"
                                    onConfirm={() => handleDeleteCategory(item.id)}
                                >
                                    <Button
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined />}
                                    />
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta 
                                title={item.name} 
                                description={item.nameEn ? `EN: ${item.nameEn}` : undefined}
                            />
                        </List.Item>
                    )}
                />
            </Flex>
        </Modal>
    </>)
}

export default BlogForm;