'use client'

import React, {useState} from 'react';
import {Avatar, Button, Dropdown, Menu, Space, Typography} from 'antd';
import {CommentData} from '../../lib/definitions';
import {DeleteOutlined, EllipsisOutlined} from '@ant-design/icons';
import {formatDistance} from 'date-fns';
import {vi} from 'date-fns/locale';
import {deleteComment, fetchCommentReplies} from '../../lib/service/commentService';
import CommentForm from './CommentForm';
import {useSession} from 'next-auth/react';

interface CommentItemProps {
    comment: CommentData;
    blogPostId: string;
    onCommentUpdate: () => void;
    level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                     comment,
                                                     blogPostId,
                                                     onCommentUpdate,
                                                     level = 0
                                                 }) => {
    const {data: session} = useSession();
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replies, setReplies] = useState<CommentData[]>(comment.replies || []);
    const [loadedReplies, setLoadedReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);

    const handleReplyClick = async () => {
        setIsReplying(!isReplying);

        if (!loadedReplies && comment.replyCount > 0) {
            try {
                setLoadingReplies(true);
                const fetchedReplies = await fetchCommentReplies(comment.id);
                setReplies(fetchedReplies);
                setLoadedReplies(true);
                setLoadingReplies(false);
            } catch (error) {
                console.error('Failed to load replies:', error);
                setLoadingReplies(false);
            }
        }

        if (comment.replyCount > 0) {
            setShowReplies(!showReplies);
        }
    };

    const handleLoadReplies = async () => {
        if (!loadedReplies) {
            try {
                setLoadingReplies(true);
                const fetchedReplies = await fetchCommentReplies(comment.id);
                setReplies(fetchedReplies);
                setLoadedReplies(true);
                setLoadingReplies(false);
            } catch (error) {
                console.error('Failed to load replies:', error);
                setLoadingReplies(false);
            }
        }
        setShowReplies(!showReplies);
    };

    const handleDelete = async () => {
        const result = await deleteComment(comment.id);
        if (result.success) {
            onCommentUpdate();
        }
    };

    const dropdownMenu = (
        <Menu>
            {session?.user?.id === comment.userId && (
                <Menu.Item key="delete" onClick={handleDelete} icon={<DeleteOutlined/>}>
                    Xóa
                </Menu.Item>
            )}
        </Menu>
    );

    const timeAgo = (dateString: string) => {
        try {
            const date = new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'));
            return formatDistance(date, new Date(), {addSuffix: true, locale: vi});
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="comment-item" style={{marginBottom: 16, marginLeft: level > 0 ? 40 : 0}}>
            <div className="comment-content" style={{display: 'flex'}}>
                <Avatar src={comment.userAvatar} alt={comment.username}/>
                <div style={{marginLeft: 12, flex: 1}}>
                    <div className="comment-bubble" style={{
                        backgroundColor: '#f0f2f5',
                        borderRadius: 18,
                        padding: '8px 12px',
                        display: 'inline-block',
                        maxWidth: '100%'
                    }}>
                        <Typography.Text strong>{comment.username}</Typography.Text>
                        {comment.mentionedUsername && (
                            <Typography.Text type="secondary" style={{marginLeft: 4}}>
                                @{comment.mentionedUsername}
                            </Typography.Text>
                        )}
                        <Typography.Paragraph style={{marginBottom: 0, whiteSpace: 'pre-wrap'}}>
                            {comment.content}
                        </Typography.Paragraph>
                    </div>

                    <div className="comment-actions" style={{marginTop: 4}}>
                        <Space size="middle">
                            <Button type="link" size="small" onClick={handleReplyClick}>
                                Trả lời
                            </Button>
                            <Typography.Text type="secondary" style={{fontSize: 12}}>
                                {timeAgo(comment.createdDate)}
                            </Typography.Text>
                            {session?.user?.id === comment.userId && (
                                <Dropdown overlay={dropdownMenu} trigger={['click']}>
                                    <Button type="text" icon={<EllipsisOutlined/>} size="small"/>
                                </Dropdown>
                            )}
                        </Space>
                    </div>

                    {isReplying && (
                        <div style={{marginTop: 8}}>
                            <CommentForm
                                blogPostId={blogPostId}
                                parentId={comment.id}
                                mentionedUserId={comment.userId}
                                mentionedUsername={comment.username}
                                onSuccess={() => {
                                    onCommentUpdate();
                                    setIsReplying(false);
                                    setLoadedReplies(false);
                                    setShowReplies(true);
                                }}
                            />
                        </div>
                    )}

                    {comment.replyCount > 0 && !showReplies && (
                        <Button
                            type="link"
                            onClick={handleLoadReplies}
                            style={{paddingLeft: 0}}
                            loading={loadingReplies}
                        >
                            Xem {comment.replyCount} {comment.replyCount === 1 ? 'câu trả lời' : 'câu trả lời'}
                        </Button>
                    )}

                    {showReplies && replies.length > 0 && (
                        <div className="comment-replies" style={{marginTop: 8}}>
                            {replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    blogPostId={blogPostId}
                                    onCommentUpdate={onCommentUpdate}
                                    level={level + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;