"use client";

import ViewDetailWrapper from "@/app/components/view-detail-wrapper";
import { Post } from "@/app/lib/definitions";
import { getDateFormatted } from "@/app/lib/utils";
import { useLocale } from "use-intl";
import { LANGUAGES } from "@/app/lib/constant";
import CustomNextImage from "@/app/components/next-image";
import CommentSection from "@/app/components/comment/CommentSection";
import ShareButton from "@/app/components/share-button";

export default function PostDetail({ post }: { post: Post }) {
  const locale = useLocale();
  const { id, title, content, createdDate, src } = post;

  return (
    <ViewDetailWrapper>
      <article
        className="blog-detail-article"
        style={{ maxWidth: 820, margin: "0 auto", width: "100%" }}
      >
        <header style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(1.75rem, 3.2vw, 2.45rem)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {createdDate && (
              <time
                style={{
                  fontSize: 14,
                  color: "var(--color-ink-muted)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {getDateFormatted(
                  createdDate,
                  locale === LANGUAGES.VN ? "vi" : "en"
                )}
              </time>
            )}
            <ShareButton variant="inline" />
          </div>
        </header>

        {src && (
          <div
            style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-subtle)",
              marginBottom: 28,
            }}
          >
            <CustomNextImage src={src} alt={title} aspectRatio="56.25%" />
          </div>
        )}

        <hr className="yarn-divider" style={{ margin: "28px 0" }} />

        <div
          className="editor-view text-box"
          style={{ marginInline: "auto" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div style={{ marginTop: 40 }}>
          <CommentSection id={id?.toString() || ""} type={"blog"} />
        </div>
      </article>
    </ViewDetailWrapper>
  );
}
