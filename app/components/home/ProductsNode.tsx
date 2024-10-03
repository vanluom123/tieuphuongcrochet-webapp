'use client'
import React from 'react';
import { Col, Empty, Flex, Row } from 'antd';
import { map } from 'lodash';
import { useRouter } from 'next/navigation';
import HeaderPart from "../header-part";
import ProductCard from '../product-card';
import ReadMoreBtn from '../read-more';
import { ROUTE_PATH } from '@/app/lib/constant';
import { Product } from '@/app/lib/definitions';

const ProductsNode = ({products}: {products: Product[]}) => {
 
  const router = useRouter();
  const onViewProduct = (id: React.Key) => {
    router.push(`${ROUTE_PATH.SHOP}/${id}`);
  };

  return (
    <div className="products scroll-animate">
      <HeaderPart
        titleId="Home.Product.title"
        descriptionId='Home.Product.description'
      />
      <Flex gap={48} vertical className="products-data">
        <Row gutter={[{ xs: 8, sm: 16, xl: 24 }, { xs: 8, sm: 16, xl: 24 }]}>
          {
            map(products, (product, index) =>
              <Col key={`product_${index}`} xs={12} sm={8} lg={6} >
                <ProductCard
                  loading={false}
                  product={product}
                  onReadDetail={() => onViewProduct(product.id || '')}
                />
              </Col>
            )
          }
        </Row>
      </Flex>
      {
        products?.length > 0 ?
          <div className='read-more'>
            <ReadMoreBtn path={ROUTE_PATH.SHOP} />
          </div> :
          <Empty
            imageStyle={{ height: 80 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
      }
    </div>
  );
};

export default ProductsNode;
