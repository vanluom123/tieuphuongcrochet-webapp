'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {Button, Divider, Spin, Typography, message} from 'antd';
import {CommentData, PaginatedResponse} from '../../lib/definitions';
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
    const [error, setError] = useState<string | null>(null);
    const [apiResponse, setApiResponse] = useState<any>(null);
    const pageSize = 10;

    const loadComments = useCallback(async (pageNo: number) => {
        setLoading(true);
        setError(null);
        try {
            // Load comment count first to ensure we have the most accurate count
            const count = await fetchRootCommentsCount(blogPostId);
            setCommentCount(count);
            
            if (count > 0) {
                // Sử dụng kiểu any cho data để xử lý mọi cấu trúc
                const data: any = await fetchRootComments(blogPostId, pageNo, pageSize);
                console.log('Fetched comments:', data);
                setApiResponse(data); // Lưu dữ liệu API response để debug
                
                // Kiểm tra cấu trúc dữ liệu response
                if (data) {
                    try {
                        let commentsArray: CommentData[] = [];
                        
                        // Kiểm tra tất cả các trường hợp có thể của cấu trúc dữ liệu
                        if (Array.isArray(data)) {
                            // Trường hợp data là một mảng trực tiếp
                            commentsArray = data;
                        } else if (data.content && Array.isArray(data.content)) {
                            // Trường hợp data là PaginatedResponse
                            commentsArray = data.content;
                        } else if (data.data && Array.isArray(data.data)) {
                            // Trường hợp data là { data: [...] }
                            commentsArray = data.data;
                        } else if (data.comments && Array.isArray(data.comments)) {
                            // Trường hợp data là { comments: [...] }
                            commentsArray = data.comments;
                        } else if (data.items && Array.isArray(data.items)) {
                            // Trường hợp data là { items: [...] }
                            commentsArray = data.items;
                        } else if (data.results && Array.isArray(data.results)) {
                            // Trường hợp data là { results: [...] }
                            commentsArray = data.results;
                        } else if (typeof data === 'object') {
                            // Trường hợp cuối cùng: kiểm tra xem có mảng nào trong data
                            const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
                            if (possibleArrays.length > 0) {
                                // Lấy mảng đầu tiên tìm thấy
                                commentsArray = possibleArrays[0] as CommentData[];
                            }
                        }
                        
                        // Xử lý trường hợp commentsArray vẫn trống mặc dù có count > 0
                        if (commentsArray.length === 0 && count > 0) {
                            console.warn('API trả về count > 0 nhưng không có comments nào', data);
                            // Không hiển thị lỗi cho người dùng
                            // setError('Định dạng dữ liệu không hợp lệ');
                        }
                        
                        if (pageNo === 0) {
                            setComments(commentsArray);
                        } else {
                            setComments(prev => [...prev, ...commentsArray]);
                        }
                        
                        // Xử lý phân trang
                        let totalPagesValue = 1;
                        let hasMoreValue = false;
                        
                        if ('totalPages' in data) {
                            totalPagesValue = data.totalPages || 1;
                            hasMoreValue = !(data.last === true);
                        } else if ('total_pages' in data) {
                            totalPagesValue = data.total_pages || 1;
                            hasMoreValue = pageNo + 1 < totalPagesValue;
                        } else if ('pages' in data) {
                            totalPagesValue = data.pages || 1;
                            hasMoreValue = pageNo + 1 < totalPagesValue;
                        } else if ('pageCount' in data) {
                            totalPagesValue = data.pageCount || 1;
                            hasMoreValue = pageNo + 1 < totalPagesValue;
                        } else {
                            // Mặc định nếu không có thông tin phân trang
                            hasMoreValue = commentsArray.length >= pageSize;
                        }
                        
                        setTotalPages(totalPagesValue);
                        setHasMore(hasMoreValue);
                    } catch (err) {
                        console.error('Error processing comments data:', err);
                        setError('Lỗi xử lý dữ liệu bình luận');
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
            setError('Không thể tải bình luận');
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

    const getCommentKey = (comment: CommentData, index: number) => {
        // Đảm bảo mỗi comment có một key duy nhất
        return comment.id ? comment.id.toString() : `comment-${index}-${Date.now()}`;
    };

    // Hàm debug để kiểm tra dữ liệu API
    const debugApiResponse = () => {
        console.log('API Response:', apiResponse);
        console.log('Comments State:', comments);
        
        if (apiResponse) {
            const responseJson = JSON.stringify(apiResponse, null, 2);
            message.info('Dữ liệu đã được ghi vào console');
            
            // Tạo debug info trên giao diện
            const debugInfo = document.createElement('div');
            debugInfo.id = 'comments-debug-info';
            debugInfo.style.display = 'block'; // Hiển thị để xem dữ liệu
            debugInfo.style.whiteSpace = 'pre';
            debugInfo.style.fontFamily = 'monospace';
            debugInfo.style.fontSize = '12px';
            debugInfo.style.padding = '10px';
            debugInfo.style.backgroundColor = '#f0f0f0';
            debugInfo.style.maxHeight = '300px';
            debugInfo.style.overflow = 'auto';
            debugInfo.style.marginTop = '20px';
            debugInfo.textContent = responseJson;
            
            // Xóa debugInfo cũ nếu đã tồn tại
            const oldDebugInfo = document.getElementById('comments-debug-info');
            if (oldDebugInfo) {
                oldDebugInfo.remove();
            }
            
            // Thêm vào phần comments-section
            const commentSection = document.querySelector('.comment-section');
            if (commentSection) {
                commentSection.appendChild(debugInfo);
            } else {
                document.body.appendChild(debugInfo);
            }
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
                            {comments.map((comment, index) => (
                                <CommentItem
                                    key={getCommentKey(comment, index)}
                                    comment={comment}
                                    blogPostId={blogPostId}
                                    onCommentUpdate={handleCommentUpdate}
                                />
                            ))}
                        </div>
                    ) : (
                        <Typography.Text type="secondary"
                                       style={{display: 'block', textAlign: 'center', padding: '16px 0'}}>
                            {commentCount > 0 ? (error || 'Đang tải bình luận...') : 'Hãy là người đầu tiên bình luận!'}
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

                    {/* Nút debug - luôn hiển thị để dễ dàng kiểm tra lỗi */}
                    <div style={{marginTop: 16, textAlign: 'center'}}>
                        <Button size="small" onClick={handleCommentUpdate}>
                            Tải lại bình luận
                        </Button>
                        <Button 
                            size="small" 
                            onClick={debugApiResponse} 
                            style={{marginLeft: 8}}
                            type="dashed"
                        >
                            Debug API
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CommentSection;