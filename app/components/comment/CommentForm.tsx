'use client'

import React, { useState } from 'react';
import { Button, Col, Form, Input, message, Row, Space, Spin } from 'antd';
import { createUpdateComment } from '../../lib/service/commentService';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
const { TextArea } = Input;

interface CommentFormProps {
    blogPostId?: string;
    productId?: string;
    freePatternId?: string;
    onSuccess: () => void;
    parentId?: string;
    mentionedUserId?: string;
    mentionedUsername?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
    blogPostId,
    productId,
    freePatternId,
    onSuccess,
    parentId,
    mentionedUserId,
    mentionedUsername
}) => {
    const { data: session, status } = useSession();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const t = useTranslations('Comment');

    const handleSubmit = async (values: { content: string }) => {       
        const contentTrim = values.content.trim();
        if (!session || status !== 'authenticated') {
            message.error(t('login_to_comment'));
            return;
        }
        setSubmitting(true);
        try {
            const result = await createUpdateComment({
                blogPostId,
                productId,
                freePatternId,
                content: contentTrim,
                parentId,
                mentionedUserId
            });

            if (result.success) {
                form.resetFields();
                onSuccess();
                message.success(t('success'));
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            message.error(t('error'));
        } finally {
            setSubmitting(false);
        }
    };

    const placeholder = mentionedUsername
        ? `${t('reply')} @${mentionedUsername}...`
        : t('placeholder');

    const submitButtonText = parentId ? t('reply') : t('comment');

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const isEmpty = e.target.value.trim() === '';
        if (isEmpty !== disabled) {
            setDisabled(isEmpty);
        }
    };

    if (status === 'loading') {
        return <Spin size="small" />;
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
                style={{ marginBottom: 12 }}
            >
                <TextArea
                    placeholder={placeholder}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    disabled={status !== 'authenticated'}
                    onChange={handleContentChange}
                />
            </Form.Item>

            <Row justify="end">
                <Col>
                    <Space>
                        {status !== 'authenticated' && (
                            <Button type="primary" href="/login">
                                {t('login_to_comment')}
                            </Button>
                        )}
                        {status === 'authenticated' && (
                            <Button
                                disabled={disabled}
                                type="primary"
                                htmlType="submit"
                                loading={submitting}>
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