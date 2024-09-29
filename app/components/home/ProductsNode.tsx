import React from 'react';
import { Col, Empty, Flex, Row } from 'antd';
import { map } from 'lodash';

import HeaderPart from "../header-part";
import ProductCard from '../product-card';
import ReadMoreBtn from '../read-more';
import { ROUTE_PATH } from '@/app/lib/constant';
import { Product } from '@/app/lib/definitions';
import patternImg from '../../../public/shope.jpg';


export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cozy Knit Sweater',
    price: 59.99,
    description: 'A warm and stylish knit sweater perfect for chilly days.',
    images: [
      {
        fileContent: 'base64encodedstring',
        fileName: 'cozy_sweater.jpg',
        url: 'https://example.com/images/cozy_sweater.jpg'
      }
    ],
    src: patternImg.src,
    author: 'Jane Doe',
    currency_code: 'USD',
    category: { id: 'cat1', name: 'Sweaters' },
    imagesPreview: [
      { src: 'https://example.com/images/cozy_sweater_preview.jpg', alt: 'Cozy Knit Sweater Preview' }
    ],
    link: '/products/cozy-knit-sweater',
    content: 'This cozy knit sweater is made from soft, high-quality yarn...'
  },
  {
    id: '2',
    name: 'Summer Breeze Dress',
    price: 45.50,
    description: 'A light and airy dress perfect for summer days.',
    images: [
      {
        fileContent: 'base64encodedstring',
        fileName: 'summer_dress.jpg',
        url: 'https://example.com/images/summer_dress.jpg'
      }
    ],
    src: 'https://example.com/images/summer_dress.jpg',
    author: 'Emily Smith',
    currency_code: 'EUR',
    category: { id: 'cat2', name: 'Dresses' },
    imagesPreview: [
      { src: 'https://example.com/images/summer_dress_preview.jpg', alt: 'Summer Breeze Dress Preview' }
    ],
    link: '/products/summer-breeze-dress',
    content: 'This Summer Breeze Dress is designed to keep you cool and stylish...'
  },
  {
    id: '3',
    name: 'Classic Denim Jeans',
    price: 79.99,
    description: 'Timeless denim jeans that never go out of style.',
    images: [
      {
        fileContent: 'base64encodedstring',
        fileName: 'denim_jeans.jpg',
        url: 'https://example.com/images/denim_jeans.jpg'
      }
    ],
    src: 'https://example.com/images/denim_jeans.jpg',
    author: 'John Smith',
    currency_code: 'GBP',
    category: { id: 'cat3', name: 'Jeans' },
    imagesPreview: [
      { src: 'https://example.com/images/denim_jeans_preview.jpg', alt: 'Classic Denim Jeans Preview' }
    ],
    link: '/products/classic-denim-jeans',
    content: 'Our Classic Denim Jeans are crafted from high-quality denim...'
  }
];

const ProductsNode = () => {

  // const products = useAppSelector(selectHomeProducts);
  // const loading = useAppSelector(selectHomeLoading);
  // const navigate = useNavigate();

  // const onViewProduct = (id) => {
  //   navigate(`${ROUTE_PATH.SHOP}/${ROUTE_PATH.DETAIL}/${id}`);
  // };

  const products = mockProducts;
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
                  // onReadDetail={() => onViewProduct(product.id || '')}
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
