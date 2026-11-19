"use client";

import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Space,
  Typography,
} from "antd";
import { CommentData } from "../../lib/definitions";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  createUpdateComment,
  deleteComment,
  fetchCommentReplies,
} from "../../lib/service/commentService";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROUTE_PATH, USER_ROLES } from "../../lib/constant";
import { timeUtils } from "@/app/lib/utils";
import { useLocale } from "next-intl";

const { TextArea } = Input;

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
  level = 0,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || "");
  const [submitting, setSubmitting] = useState(false);
  const [replies, setReplies] = useState<CommentData[]>(comment.replies || []);
  const [loadedReplies, setLoadedReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const locale = useLocale();

  const fallbackCharacter = (comment.username || "A").charAt(0).toUpperCase();
  const commentId =
    comment.id ||
    `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
      } catch (error) {
        console.error("Failed to load replies:", error);
      } finally {
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
      } catch (error) {
        console.error("Failed to load replies:", error);
      } finally {
        setLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleDelete = async () => {
    const result = await deleteComment(commentId);
    if (result.success) {
      if (level > 0 && comment.parentId) {
        onCommentUpdate(true);
      } else {
        onCommentUpdate();
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content || "");
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
        parentId: comment.parentId || undefined,
      });

      if (result.success) {
        setIsEditing(false);
        if (level > 0 && comment.parentId) {
          onCommentUpdate(false);
        } else {
          onCommentUpdate();
        }
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getMenuItems = (): MenuProps["items"] => {
    if (session?.user?.id === comment.userId) {
      return [
        {
          key: "edit",
          label: "Sửa",
          icon: <EditOutlined />,
          onClick: handleEdit,
        },
        {
          key: "delete",
          label: "Xóa",
          icon: <DeleteOutlined />,
          onClick: handleDelete,
        },
      ];
    }
    if (session?.user?.role === USER_ROLES.ADMIN) {
      return [
        {
          key: "delete",
          label: "Xóa",
          icon: <DeleteOutlined />,
          onClick: handleDelete,
        },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  const getReplyKey = (reply: CommentData, index: number) => {
    return reply.id ? reply.id.toString() : `reply-${commentId}-${index}-${Date.now()}`;
  };

  return (
    <div className={`comment-item ${level > 0 ? "is-reply" : ""}`}>
      <div className="comment-content">
        <Avatar
          src={comment.userAvatar}
          className="comment-avatar"
          icon={!comment.userAvatar && <UserOutlined />}
          alt={comment.username || "Ẩn danh"}
          onClick={() => navigateToUserProfile(comment.userId)}
        >
          {fallbackCharacter}
        </Avatar>

        <div className="comment-main">
          {isEditing ? (
            <div className="comment-edit-form" style={{ marginTop: 4 }}>
              <Form layout="vertical">
                <Form.Item style={{ marginBottom: 12 }}>
                  <TextArea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                  />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
              <div className="comment-bubble">
                <Typography.Text
                  className="comment-author"
                  onClick={() => navigateToUserProfile(comment.userId)}
                >
                  {comment.username || "Ẩn danh"}
                </Typography.Text>
                {comment.mentionedUsername && comment.mentionedUserId && (
                  <Typography.Text
                    className="comment-mention"
                    onClick={() =>
                      navigateToUserProfile(comment.mentionedUserId || "")
                    }
                  >
                    @{comment.mentionedUsername}
                  </Typography.Text>
                )}
                <Typography.Paragraph className="comment-text">
                  {comment.content || ""}
                </Typography.Paragraph>
              </div>

              <div className="comment-actions">
                <Button
                  type="link"
                  size="small"
                  className="comment-action-link"
                  onClick={handleReplyClick}
                >
                  Trả lời
                </Button>
                <span className="comment-time">
                  {timeUtils.timeAgo(comment.createdDate, locale)}
                </span>
                {(session?.user?.id === comment.userId ||
                  session?.user?.role === USER_ROLES.ADMIN) && (
                  <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                    <Button
                      type="text"
                      aria-label="Comment options"
                      icon={<EllipsisOutlined />}
                      size="small"
                    />
                  </Dropdown>
                )}
              </div>
            </>
          )}

          {isReplying && (
            <div style={{ marginTop: 10 }}>
              <CommentForm
                blogPostId={blogPostId}
                productId={productId}
                freePatternId={freePatternId}
                parentId={commentId}
                mentionedUserId={comment.userId}
                mentionedUsername={comment.username}
                onSuccess={() => {
                  const loadNewReplies = async () => {
                    try {
                      const fetchedReplies = await fetchCommentReplies(commentId);
                      setReplies(fetchedReplies);
                      setShowReplies(true);
                    } catch (error) {
                      console.error("Failed to load new replies:", error);
                    }
                  };

                  loadNewReplies();
                  setLoadedReplies(true);
                  setIsReplying(false);
                  onCommentUpdate();
                }}
              />
            </div>
          )}

          {comment.replyCount > 0 && !showReplies && (
            <Button
              type="link"
              onClick={handleLoadReplies}
              style={{ paddingLeft: 0, marginTop: 4 }}
              loading={loadingReplies}
            >
              Xem {comment.replyCount} câu trả lời
            </Button>
          )}

          {showReplies && replies.length > 0 && (
            <div className="comment-replies" style={{ marginTop: 10 }}>
              {replies.map((reply, index) => (
                <CommentItem
                  key={getReplyKey(reply, index)}
                  comment={reply}
                  blogPostId={blogPostId}
                  productId={productId}
                  freePatternId={freePatternId}
                  onCommentUpdate={(isDelete = false) => {
                    if (isDelete) {
                      setReplies((prevReplies) =>
                        prevReplies.filter((r) => r.id !== reply.id)
                      );
                    } else {
                      const updateReplies = async () => {
                        try {
                          const fetchedReplies = await fetchCommentReplies(
                            commentId
                          );
                          setReplies(fetchedReplies);
                        } catch (error) {
                          console.error("Failed to update replies:", error);
                        }
                      };
                      updateReplies();
                    }

                    onCommentUpdate();
                  }}
                  level={level + 1}
                />
              ))}
              <Button
                type="text"
                size="small"
                onClick={handleLoadReplies}
                style={{ marginTop: 4 }}
              >
                Ẩn câu trả lời
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
