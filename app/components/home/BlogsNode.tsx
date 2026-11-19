"use client";

import React from "react";
import { Col, Empty, Row } from "antd";
import { useRouter } from "next/navigation";
import { map } from "lodash";

import HeaderPart from "../header-part";
import ReadMoreBtn from "../read-more";
import { ROUTE_PATH } from "@/app/lib/constant";
import BlogCard from "../blog-card";
import { Post } from "@/app/lib/definitions";

const BlogsNode = ({ posts }: { posts: Post[] }) => {
  const router = useRouter();

  const onViewBlog = (id: React.Key) => {
    router.push(`${ROUTE_PATH.BLOG}/${id}`);
  };

  return (
    <section className="blogs home-section">
      <HeaderPart
        titleId="Home.Blog.title"
        descriptionId="Home.Blog.description"
        actionNode={
          posts?.length > 0 ? (
            <ReadMoreBtn path={ROUTE_PATH.BLOG} />
          ) : undefined
        }
      />
      {posts?.length > 0 ? (
        <Row gutter={[{ xs: 12, md: 20, xl: 24 }, 20]}>
          {map(posts, (item, index) => (
            <Col key={item.id || `blog_${index}`} xs={24} md={12} lg={8}>
              <BlogCard
                item={item}
                onReadDetail={() => onViewBlog(item.id || "")}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          imageStyle={{ height: 80 }}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </section>
  );
};

export default BlogsNode;
