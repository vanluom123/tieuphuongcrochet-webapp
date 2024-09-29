import React from "react";
import { Col, Empty, Row } from "antd";
import { map } from "lodash";

import FreePatternCard from "../free-pattern-card";
import HeaderPart from "../header-part";
import { ROUTE_PATH } from "@/app/lib/constant";
import ReadMoreBtn from "../read-more";
import { Pattern } from "@/app/lib/definitions";
import patternImg from '../../../public/shope.jpg';

export const mockPatterns: Pattern[] = [
    {
      id: 1,
      name: "Cozy Sweater",
      description: "A warm and stylish sweater pattern",
      author: "Jane Doe",
      src:patternImg.src,
      imagesPreview: [{ src: "../../../public/shope.jpg", alt: "Cozy Sweater Preview" }],
      category: { id: 1, name: "Sweaters" },
      currency_code: "USD",
      status: "SUCCESS",
      home: true
    },
    {
      id: 2,
      name: "Summer Dress",
      description: "Light and breezy summer dress pattern",
      author: "John Smith",
      src:patternImg.src,
      imagesPreview: [{ src: "../../../public/shope.jpg", alt: "Summer Dress Preview" }],
      category: { id: 2, name: "Dresses" },
      status: "PENDING"
    },
    // Add more mock patterns as needed
  ];

const FreePatternsNode = () => {
    const patterns = mockPatterns;
	return (
		<div className='patterns scroll-animate'>
			<HeaderPart
				titleId='Home.FreePattern.title'
				descriptionId='Home.FreePattern.description'
				isShowDivider
			/>
			<Row gutter={[{ xs: 8, sm: 16, xl: 24 }, { xs: 12, sm: 16, xl: 24 }]}>
				{
					map(patterns, (pattern, index) =>
						<Col key={`freepattern_${index}`} xs={12} sm={8} lg={6} >
							<FreePatternCard
								pattern={pattern}
							/>
						</Col>
					)
				}
			</Row>
			{patterns?.length > 0 ?
				< div className='read-more'>
					<ReadMoreBtn path={ROUTE_PATH.FREEPATTERNS} />
				</div> :
				<Empty
					imageStyle={{ height: 80 }}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			}
		</div >
	)
}

export default FreePatternsNode;