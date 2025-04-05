'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Divider, Spin, Typography} from 'antd';
import {CommentData} from '../../lib/definitions';
import {fetchAllCommentsCount, fetchRootComments} from '../../lib/service/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import {useInView} from 'react-intersection-observer'; // Cần cài đặt package này

interface CommentSectionProps {
    id: string;
    type: 'blog' | 'product' | 'free-pattern'
}

const CommentSection: React.FC<CommentSectionProps> = ({id, type}) => {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 10;

    // Sử dụng ref để theo dõi mảng comments hiện tại
    const commentsRef = useRef<CommentData[]>([]);

    // Thiết lập IntersectionObserver cho lazy loading
    const {ref: loadMoreRef, inView} = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    // Get the appropriate id prop based on content type
    const getContentProps = () => {
        switch (type) {
            case 'blog':
                return {blogPostId: id};
            case 'product':
                return {productId: id};
            case 'free-pattern':
                return {freePatternId: id};
            default:
                return {blogPostId: id};
        }
    };

    const loadComments = useCallback(async (pageNo: number, isLoadMore: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            // Load comment count (chỉ cần làm khi khởi tạo ban đầu hoặc refresh)
            if (!isLoadMore) {
                const count = await fetchAllCommentsCount(id, type);
                setCommentCount(count);
            }

            // Fetch comments using typed API response
            if (commentCount > 0 || isLoadMore) {
                const data = await fetchRootComments(id, type, pageNo, pageSize);

                // Nếu là tải thêm, thì giữ lại các comments cũ và thêm mới vào
                if (isLoadMore) {
                    setComments(prevComments => [...prevComments, ...(data.contents || [])]);
                } else {
                    setComments(data.contents || []);
                }

                setTotalPages(data.totalPages);
                setHasMore(!data.last);
                setPage(data.pageNo);
            } else {
                setComments([]);
                setTotalPages(0);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load comments: ', error);
            setError('Đã xảy ra lỗi khi tải bình luận.');
        } finally {
            setLoading(false);
        }
    }, [id, type, commentCount]);

    // Đồng bộ commentsRef với state hiện tại
    useEffect(() => {
        commentsRef.current = comments;
    }, [comments]);

    // Tải bình luận ban đầu
    useEffect(() => {
        loadComments(0, false);
    }, [loadComments]);

    // Xử lý tự động tải thêm khi cuộn đến cuối danh sách
    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreComments();
        }
    }, [inView, hasMore, loading]);

    const handleCommentUpdate = useCallback(() => {
        // Reset page to 0 when adding/updating comments
        setPage(0);
        loadComments(0, false);
    }, [loadComments]);

    const loadMoreComments = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadComments(nextPage, true);
        }
    };

    const getCommentKey = (comment: CommentData, index: number) => {
        // Đảm bảo mỗi comment có một key duy nhất
        return comment.id ? comment.id.toString() : `comment-${index}-${Date.now()}`;
    };

    const contentProps = getContentProps();

    return (
        <div className="comment-section">
            <Divider orientation="left">
                <Typography.Title level={4} style={{margin: 0}}>
                    Bình luận ({commentCount})
                </Typography.Title>
            </Divider>

            <div style={{marginBottom: 24}}>
                <CommentForm
                    {...contentProps}
                    onSuccess={handleCommentUpdate}
                />
            </div>

            {comments && comments.length > 0 ? (
                <div className="comment-list">
                    {comments.map((comment, index) => (
                        <CommentItem
                            key={getCommentKey(comment, index)}
                            comment={comment}
                            {...contentProps}
                            onCommentUpdate={handleCommentUpdate}
                        />
                    ))}

                    {/* Phần này sẽ trigger lazy loading khi được hiển thị */}
                    <div
                        ref={loadMoreRef}
                        style={{height: '20px', margin: '20px 0'}}
                    >
                        {loading && hasMore && (
                            <div style={{textAlign: 'center', padding: '10px 0'}}>
                                <Spin size="small"/>
                            </div>
                        )}
                    </div>

                    {/* Nút tải thêm (tùy chọn, có thể giữ lại hoặc bỏ) */}
                    {hasMore && !loading && (
                        <div style={{textAlign: 'center', padding: '10px 0'}}>
                            <Button onClick={loadMoreComments}>
                                Xem thêm bình luận
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {loading ? (
                        <div style={{textAlign: 'center', padding: 24}}>
                            <Spin/>
                        </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: 24}}>
                            <Typography.Text type="secondary">
                                Chưa có bình luận nào. Hãy để lại bình luận đầu tiên!
                            </Typography.Text>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommentSection;