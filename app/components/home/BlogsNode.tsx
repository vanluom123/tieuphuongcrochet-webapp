import React from "react";
import { Col, Empty, Row } from "antd"
import { map } from "lodash";
import HeaderPart from "../header-part";
import ReadMoreBtn from "../read-more";
import { ROUTE_PATH } from "@/app/lib/constant";
import BlogCard from "../blog-card";
import { Post } from "@/app/lib/definitions";
import patternImg from '../../../public/shope.jpg';

// Mock data for Post
export const mockPosts: Post[] = [
	{
	  id: 1,
	  title: "Getting Started with Knitting",
	  content: "Learn the basics of knitting with this beginner-friendly guide...",
	  createdDate: "2023-03-15T10:30:00Z",
	  src: patternImg.src,
	  is_home: true
	},
	{
	  id: 2,
	  title: "Advanced Crochet Techniques",
	  content: "Explore advanced crochet techniques to take your skills to the next level...",
	  createdDate: "2023-04-02T14:45:00Z",
	  files: [
		{
		  fileContent: "base64encodedcontent...",
		  fileName: "crochet-pattern.pdf",
		  url: "https://example.com/files/crochet-pattern.pdf"
		}
	  ],
	  is_home: false,
	  src: patternImg.src,
	},
	{
	  id: 3,
	  title: "Summer Knitting Projects",
	  content: "Discover cool and breezy knitting projects perfect for summer...",
	  createdDate: "2023-05-20T09:15:00Z",
	  src: patternImg.src,
	  is_home: true
	}
  ];
  
const BlogsNode = () => {
	// const blogs = useAppSelector(selectBlogs);
	const blogs = mockPosts;
	return (
		<div className='blogs scroll-animate'>
			<HeaderPart titleId='Home.Blog.title'
				descriptionId='Home.Blog.description'
			/>
			<Row gutter={[{ xs: 12, md: 16, xl: 32 }, 24]}>
				{map(blogs, (item, index) =>
					<Col key={`blog_${index}`} xs={24} md={12} lg={8}>
						<BlogCard
							item={item}
						/>
					</Col>
				)}
			</Row>
			{
				blogs?.length > 0 ?
					<div className='read-more'>
						<ReadMoreBtn path={ROUTE_PATH.BLOG} />
					</div> :
					<Empty
						imageStyle={{ height: 80 }}
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						
					/>
			}
		</div>
	)
}

export default BlogsNode;
