"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Spin, Typography } from "antd";
import { useTranslations } from "next-intl";
import { CommentData } from "../../lib/definitions";
import {
  fetchAllCommentsCount,
  fetchRootComments,
} from "../../lib/service/commentService";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useInView } from "react-intersection-observer";
import "@/app/ui/components/comment.scss";

interface CommentSectionProps {
  id: string;
  type: "blog" | "product" | "free-pattern";
}

const CommentSection: React.FC<CommentSectionProps> = ({ id, type }) => {
  const t = useTranslations("Comment");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const commentsRef = useRef<CommentData[]>([]);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const getContentProps = () => {
    switch (type) {
      case "blog":
        return { blogPostId: id };
      case "product":
        return { productId: id };
      case "free-pattern":
        return { freePatternId: id };
      default:
        return { blogPostId: id };
    }
  };

  const loadComments = useCallback(
    async (pageNo: number, isLoadMore: boolean = false) => {
      setLoading(true);
      setError(null);
      try {
        if (!isLoadMore) {
          const count = await fetchAllCommentsCount(id, type);
          setCommentCount(count);
        }

        if (commentCount > 0 || isLoadMore) {
          const data = await fetchRootComments(id, type, pageNo, pageSize);

          if (isLoadMore) {
            setComments((prevComments) => [
              ...prevComments,
              ...(data.contents || []),
            ]);
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
      } catch (err) {
        console.error("Failed to load comments: ", err);
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    },
    [id, type, commentCount, t]
  );

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  useEffect(() => {
    loadComments(0, false);
  }, [loadComments]);

  const loadMoreComments = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadComments(nextPage, true);
    }
  }, [loading, hasMore, page, loadComments]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreComments();
    }
  }, [inView, hasMore, loading, loadMoreComments]);

  const handleCommentUpdate = useCallback(() => {
    setPage(0);
    loadComments(0, false);
  }, [loadComments]);

  const getCommentKey = (comment: CommentData, index: number) => {
    return comment.id
      ? comment.id.toString()
      : `comment-${index}-${Date.now()}`;
  };

  const contentProps = getContentProps();

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <Typography.Title level={4} className="comment-section__title">
          {t("title")} ({commentCount})
        </Typography.Title>
      </div>

      <div style={{ marginBottom: 24 }}>
        <CommentForm {...contentProps} onSuccess={handleCommentUpdate} />
      </div>

      {error && (
        <Typography.Text type="danger" style={{ display: "block", marginBottom: 12 }}>
          {error}
        </Typography.Text>
      )}

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

          <div ref={loadMoreRef} style={{ height: 20, margin: "16px 0" }}>
            {loading && hasMore && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <Spin size="small" />
              </div>
            )}
          </div>

          {hasMore && !loading && (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <Button onClick={loadMoreComments}>Xem thêm bình luận</Button>
            </div>
          )}
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Typography.Text type="secondary">
            Chưa có bình luận nào. Hãy để lại bình luận đầu tiên!
          </Typography.Text>
        </div>
      )}
    </section>
  );
};

export default CommentSection;
