'use client'

import React, {useState} from 'react';
import {Avatar, Button, Dropdown, Form, Input, Menu, Space, Typography} from 'antd';
import {CommentData} from '../../lib/definitions';
import {DeleteOutlined, EditOutlined, EllipsisOutlined, UserOutlined} from '@ant-design/icons';
import {formatDistance} from 'date-fns';
import {vi} from 'date-fns/locale';
import {createUpdateComment, deleteComment, fetchCommentReplies} from '../../lib/service/commentService';
import CommentForm from './CommentForm';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {ROUTE_PATH, USER_ROLES} from '../../lib/constant';

const {TextArea} = Input;

interface CommentItemProps {
    comment: CommentData;
    blogPostId?: string;
    productId?: string;
    freePatternId?: string;
    onCommentUpdate: (isDelete?: boolean) => void;
    level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                     comment,
                                                     blogPostId,
                                                     productId,
                                                     freePatternId,
                                                     onCommentUpdate,
                                                     level = 0
                                                 }) => {
    const {data: session} = useSession();
    const router = useRouter();
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content || '');
    const [submitting, setSubmitting] = useState(false);
    const [replies, setReplies] = useState<CommentData[]>(comment.replies || []);
    const [loadedReplies, setLoadedReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);

    // Lấy ký tự đầu tiên của tên user nếu ảnh không tải được
    const fallbackCharacter = comment.username.charAt(0).toUpperCase();

    // Đảm bảo comment.id luôn có giá trị
    const commentId = comment.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Navigate to user profile
    const navigateToUserProfile = (userId: string) => {
        if (userId) {
            router.push(`${ROUTE_PATH.PROFILE}/${userId}`);
        }
    };

    const handleReplyClick = async () => {
        setIsReplying(!isReplying);

        if (!loadedReplies && comment.replyCount > 0) {
            try {
                setLoadingReplies(true);
                const fetchedReplies = await fetchCommentReplies(commentId);
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
                const fetchedReplies = await fetchCommentReplies(commentId);
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
        const result = await deleteComment(commentId);
        if (result.success) {
            if (level > 0 && comment.parentId) {
                // Nếu là reply, thông báo cho parent và chỉ rõ đây là thao tác xóa
                onCommentUpdate(true);
            } else {
                // Nếu là comment gốc, chỉ cần gọi onCommentUpdate
                onCommentUpdate();
            }
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(comment.content || '');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) return;

        setSubmitting(true);
        try {
            const result = await createUpdateComment({
                id: commentId,
                blogPostId,
                productId,
                freePatternId,
                content: editContent,
                parentId: comment.parentId || undefined
            });

            if (result.success) {
                setIsEditing(false);
                
                // Cập nhật comment hiện tại với nội dung mới
                if (level > 0 && comment.parentId) {
                    // Nếu đây là một reply, thông báo cho parent component 
                    // truyền false để biết đây không phải là xóa mà là sửa
                    onCommentUpdate(false);
                } else {
                    // Nếu là root comment thì chỉ cần gọi onCommentUpdate
                    onCommentUpdate();
                }
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const dropdownMenu = (
        <Menu>
            {session?.user?.id === comment.userId ? (
                <>
                    <Menu.Item key="edit" onClick={handleEdit} icon={<EditOutlined/>}>
                        Sửa
                    </Menu.Item>
                    <Menu.Item key="delete" onClick={handleDelete} icon={<DeleteOutlined/>}>
                        Xóa
                    </Menu.Item>
                </>
            ) : session?.user?.role === USER_ROLES.ADMIN && (
                <Menu.Item key="delete" onClick={handleDelete} icon={<DeleteOutlined/>}>
                    Xóa
                </Menu.Item>
            )}
        </Menu>
    );

    const timeAgo = (dateString: string) => {
        if (!dateString) return '';

        try {
            // Kiểm tra định dạng "dd/MM/yyyy HH:mm:ss"
            if (/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/.test(dateString)) {
                const date = new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'));
                return formatDistance(date, new Date(), {addSuffix: true, locale: vi});
            }

            // Nếu là định dạng ISO hoặc định dạng khác
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return formatDistance(date, new Date(), {addSuffix: true, locale: vi});
            }

            return dateString;
        } catch (e) {
            console.error('Error parsing date:', e, dateString);
            return dateString;
        }
    };

    // Hàm tạo key duy nhất cho mỗi reply
    const getReplyKey = (reply: CommentData, index: number) => {
        return reply.id ? reply.id.toString() : `reply-${commentId}-${index}-${Date.now()}`;
    };

    return (
        <div className="comment-item" style={{marginBottom: 16, marginLeft: level > 0 ? 40 : 0}}>
            <div className="comment-content" style={{display: 'flex'}}>
                <Avatar
                    src={comment.userAvatar}
                    style={{backgroundColor: '#FF8282', verticalAlign: 'middle', cursor: 'pointer'}}
                    icon={!comment.userAvatar && <UserOutlined/>}
                    alt={comment.username || 'Ẩn danh'}
                    onClick={() => navigateToUserProfile(comment.userId)}
                >
                    {fallbackCharacter}
                </Avatar>

                <div style={{marginLeft: 12, flex: 1}}>
                    {isEditing ? (
                        <div className="comment-edit-form" style={{marginTop: 8}}>
                            <Form layout="vertical">
                                <Form.Item style={{marginBottom: 12}}>
                                    <TextArea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        autoSize={{minRows: 2, maxRows: 6}}
                                    />
                                </Form.Item>
                                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Space>
                                        <Button size="small" onClick={handleCancelEdit}>
                                            Hủy
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="small"
                                            onClick={handleSaveEdit}
                                            loading={submitting}
                                        >
                                            Lưu
                                        </Button>
                                    </Space>
                                </div>
                            </Form>
                        </div>
                    ) : (
                        <>
                            <div className="comment-bubble" style={{
                                backgroundColor: '#f0f2f5',
                                borderRadius: 18,
                                padding: '8px 12px',
                                display: 'inline-block',
                                maxWidth: '100%'
                            }}>
                                <Typography.Text
                                    strong
                                    style={{cursor: 'pointer'}}
                                    onClick={() => navigateToUserProfile(comment.userId)}
                                >
                                    {comment.username || 'Ẩn danh'}
                                </Typography.Text>
                                {comment.mentionedUsername && comment.mentionedUserId && (
                                    <Typography.Text
                                        type="secondary"
                                        style={{marginLeft: 4, cursor: 'pointer'}}
                                        onClick={() => navigateToUserProfile(comment.mentionedUserId || '')}
                                    >
                                        @{comment.mentionedUsername}
                                    </Typography.Text>
                                )}
                                <Typography.Paragraph style={{marginBottom: 0, whiteSpace: 'pre-wrap'}}>
                                    {comment.content || ''}
                                </Typography.Paragraph>
                            </div>

                            <div className="comment-actions" style={{marginTop: 4}}>
                                <Space size="middle">
                                    <Button type="link" size="small" onClick={handleReplyClick}>
                                        Trả lời
                                    </Button>
                                    <Typography.Text type="secondary" style={{fontSize: 12}}>
                                        {timeAgo(comment.createdDate || '')}
                                    </Typography.Text>
                                    {(session?.user?.id === comment.userId || session?.user?.role === USER_ROLES.ADMIN) && (
                                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                                            <Button type="text" icon={<EllipsisOutlined/>} size="small"/>
                                        </Dropdown>
                                    )}
                                </Space>
                            </div>
                        </>
                    )}

                    {isReplying && (
                        <div style={{marginTop: 8}}>
                            <CommentForm
                                blogPostId={blogPostId}
                                productId={productId}
                                freePatternId={freePatternId}
                                parentId={commentId}
                                mentionedUserId={comment.userId}
                                mentionedUsername={comment.username}
                                onSuccess={() => {
                                    // Tải lại danh sách replies ngay sau khi thêm thành công
                                    const loadNewReplies = async () => {
                                        try {
                                            const fetchedReplies = await fetchCommentReplies(commentId);
                                            setReplies(fetchedReplies);
                                            // Đảm bảo hiển thị danh sách replies
                                            setShowReplies(true);
                                        } catch (error) {
                                            console.error('Failed to load new replies:', error);
                                        }
                                    };
                                    
                                    loadNewReplies();
                                    // Đánh dấu đã tải replies để không tải lại khi click vào nút Xem replies
                                    setLoadedReplies(true);
                                    // Ẩn form reply
                                    setIsReplying(false);
                                    // Thông báo component cha cập nhật
                                    onCommentUpdate();
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
                            {replies.map((reply, index) => (
                                <CommentItem
                                    key={getReplyKey(reply, index)}
                                    comment={reply}
                                    blogPostId={blogPostId}
                                    productId={productId}
                                    freePatternId={freePatternId}
                                    onCommentUpdate={(isDelete = false) => {
                                        if (isDelete) {
                                            // Nếu là xóa reply, thì lọc nó ra khỏi danh sách ngay lập tức
                                            setReplies(prevReplies => prevReplies.filter(r => r.id !== reply.id));
                                        } else {
                                            // Nếu là sửa reply hoặc hành động khác, tải lại toàn bộ replies
                                            const updateReplies = async () => {
                                                try {
                                                    const fetchedReplies = await fetchCommentReplies(commentId);
                                                    setReplies(fetchedReplies);
                                                } catch (error) {
                                                    console.error('Failed to update replies:', error);
                                                }
                                            };
                                            updateReplies();
                                        }
                                        
                                        // Sau đó gọi onCommentUpdate để thông báo cho component cha
                                        onCommentUpdate();
                                    }}
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