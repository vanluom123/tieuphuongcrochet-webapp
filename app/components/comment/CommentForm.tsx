'use client'

import React, {useState} from 'react';
import {Button, Col, Form, Input, message, Row, Space, Spin} from 'antd';
import {createUpdateComment} from '../../lib/service/commentService';
import {useSession} from 'next-auth/react';

const {TextArea} = Input;

interface CommentFormProps {
    blogPostId: string;
    onSuccess: () => void;
    parentId?: string;
    mentionedUserId?: string;
    mentionedUsername?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
                                                     blogPostId,
                                                     onSuccess,
                                                     parentId,
                                                     mentionedUserId,
                                                     mentionedUsername
                                                 }) => {
    const {data: session, status} = useSession();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: { content: string }) => {
        if (!session || status !== 'authenticated') {
            message.error('Vui lòng đăng nhập để bình luận');
            return;
        }

        setSubmitting(true);
        try {
            const result = await createUpdateComment({
                blogPostId,
                content: values.content,
                parentId,
                mentionedUserId
            });

            if (result.success) {
                form.resetFields();
                onSuccess();
                message.success('Bình luận đã được đăng thành công');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            message.error('Không thể đăng bình luận. Vui lòng thử lại sau.');
        } finally {
            setSubmitting(false);
        }
    };

    const placeholder = mentionedUsername
        ? `Trả lời @${mentionedUsername}...`
        : 'Viết bình luận của bạn...';

    const submitButtonText = parentId ? 'Trả lời' : 'Bình luận';

    if (status === 'loading') {
        return <Spin size="small"/>;
    }

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            requiredMark={false}
        >
            <Form.Item
                name="content"
                rules={[{required: true, message: 'Vui lòng nhập nội dung bình luận'}]}
                style={{marginBottom: 12}}
            >
                <TextArea
                    placeholder={placeholder}
                    autoSize={{minRows: 2, maxRows: 6}}
                    disabled={status !== 'authenticated'}
                />
            </Form.Item>

            <Row justify="end">
                <Col>
                    <Space>
                        {status !== 'authenticated' && (
                            <Button type="primary" href="/login">
                                Đăng nhập để bình luận
                            </Button>
                        )}
                        {status === 'authenticated' && (
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                {submitButtonText}
                            </Button>
                        )}
                    </Space>
                </Col>
            </Row>
        </Form>
    );
};

export default CommentForm;