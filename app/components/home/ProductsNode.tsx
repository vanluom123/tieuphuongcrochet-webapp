"use client";
import React from "react";
import { Col, Empty, Row } from "antd";
import { map } from "lodash";
import { useRouter } from "next/navigation";

import HeaderPart from "../header-part";
import ProductCard from "../product-card";
import ReadMoreBtn from "../read-more";
import { ROUTE_PATH } from "@/app/lib/constant";
import { Product } from "@/app/lib/definitions";

const ProductsNode = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const onViewProduct = (id: React.Key) => {
    router.push(`${ROUTE_PATH.SHOP}/${id}`);
  };

  return (
    <section className="products home-section">
      <HeaderPart
        isShowDivider
        titleId="Home.Product.title"
        descriptionId="Home.Product.description"
        actionNode={
          products?.length > 0 ? (
            <ReadMoreBtn path={ROUTE_PATH.SHOP} />
          ) : undefined
        }
      />
      {products?.length > 0 ? (
        <Row
          gutter={[
            { xs: 12, sm: 16, xl: 24 },
            { xs: 20, sm: 24, xl: 28 },
          ]}
        >
          {map(products, (product, index) => (
            <Col
              key={product.id || `product_${index}`}
              xs={12}
              sm={8}
              lg={6}
            >
              <ProductCard
                loading={false}
                product={product}
                onReadDetail={() => onViewProduct(product.id || "")}
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

export default ProductsNode;
