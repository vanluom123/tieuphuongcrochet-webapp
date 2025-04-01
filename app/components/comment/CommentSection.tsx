'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {Button, Divider, Spin, Typography} from 'antd';
import {CommentData} from '../../lib/definitions';
import {fetchRootComments, fetchRootCommentsCount} from '../../lib/service/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentSectionProps {
    blogPostId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({blogPostId}) => {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const pageSize = 10;

    const loadComments = useCallback(async (pageNo: number) => {
        setLoading(true);
        try {
            // Load comment count first to ensure we have the most accurate count
            const count = await fetchRootCommentsCount(blogPostId);
            setCommentCount(count);
            
            if (count > 0) {
                const data = await fetchRootComments(blogPostId, pageNo, pageSize);
                console.log('Fetched comments:', data);
                
                if (data && data.content) {
                    if (pageNo === 0) {
                        setComments(data.content);
                    } else {
                        setComments(prev => [...prev, ...data.content]);
                    }
                    
                    setTotalPages(data.totalPages);
                    setHasMore(!data.last);
                }
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    }, [blogPostId]);

    useEffect(() => {
        loadComments(0);
    }, [loadComments]);

    const handleCommentUpdate = useCallback(() => {
        // Reset page to 0 when adding/updating comments
        setPage(0);
        loadComments(0);
    }, [loadComments]);

    const loadMoreComments = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadComments(nextPage);
        }
    };

    return (
        <div className="comment-section">
            <Divider orientation="left">
                <Typography.Title level={4} style={{margin: 0}}>
                    Bình luận ({commentCount})
                </Typography.Title>
            </Divider>

            <div style={{marginBottom: 24}}>
                <CommentForm
                    blogPostId={blogPostId}
                    onSuccess={handleCommentUpdate}
                />
            </div>

            {loading && comments.length === 0 ? (
                <div style={{textAlign: 'center', padding: 24}}>
                    <Spin/>
                </div>
            ) : (
                <>
                    {comments && comments.length > 0 ? (
                        <div className="comment-list">
                            {comments.map(comment => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    blogPostId={blogPostId}
                                    onCommentUpdate={handleCommentUpdate}
                                />
                            ))}
                        </div>
                    ) : (
                        <Typography.Text type="secondary"
                                       style={{display: 'block', textAlign: 'center', padding: '16px 0'}}>
                            {commentCount > 0 ? 'Không thể tải bình luận. Vui lòng thử lại sau.' : 'Hãy là người đầu tiên bình luận!'}
                        </Typography.Text>
                    )}

                    {hasMore && (
                        <div style={{textAlign: 'center', marginTop: 16}}>
                            <Button
                                onClick={loadMoreComments}
                                loading={loading && page > 0}
                            >
                                Xem thêm bình luận
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommentSection;