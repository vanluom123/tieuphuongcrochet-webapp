'use client'

import React, {useState} from 'react';
import {Avatar, Button, Input} from 'antd';
import {createUpdateComment} from '../../lib/service/commentService';
import {useSession} from 'next-auth/react';
import {SendOutlined} from '@ant-design/icons';

interface CommentFormProps {
    blogPostId: string;
    parentId?: string;
    commentId?: string;
    initialValue?: string;
    mentionedUserId?: string;
    mentionedUsername?: string;
    onSuccess: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
                                                     blogPostId,
                                                     parentId,
                                                     commentId,
                                                     initialValue = '',
                                                     mentionedUserId,
                                                     mentionedUsername,
                                                     onSuccess
                                                 }) => {
    const {data: session} = useSession();
    const [content, setContent] = useState(initialValue);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setSubmitting(true);

        const data = {
            ...(commentId && {id: commentId}),
            blogPostId,
            content: content.trim(),
            ...(parentId && {parentId}),
            ...(mentionedUserId && {mentionedUserId})
        };

        const result = await createUpdateComment(data);

        setSubmitting(false);

        if (result.success) {
            setContent('');
            onSuccess();
        }
    };

    const placeholder = mentionedUsername
        ? `Reply to @${mentionedUsername}...`
        : 'Write a comment...';

    return (
        <div style={{display: 'flex', alignItems: 'flex-start', gap: 12}}>
            <Avatar
                src={session?.user?.imageUrl}
                alt={session?.user?.name || 'User'}
                size="default"
            />
            <div style={{flexGrow: 1, display: 'flex'}}>
                <Input.TextArea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    autoSize={{minRows: 1, maxRows: 6}}
                    disabled={submitting || !session}
                    style={{
                        borderRadius: '18px',
                        padding: '8px 12px',
                        resize: 'none',
                        backgroundColor: '#f0f2f5'
                    }}
                    onPressEnter={(e) => {
                        if (!e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                />
                <Button
                    type="text"
                    icon={<SendOutlined/>}
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={!content.trim() || !session}
                    style={{marginLeft: 8}}
                />
            </div>
        </div>
    );
};

export default CommentForm;