import { Spin } from 'antd';
import FreePatternsNode from './components/home/FreePatternsNode';
import ProductsNode from './components/home/ProductsNode';
import BlogsNode from './components/home/BlogsNode';
import SocialNode from './components/home/SocialNode';
import './ui/home.scss';
export default async function Home() {

  return (
<div className='home-page'>
			<Spin spinning={false} tip="Loading...">
				{/* Product list */}
				<ProductsNode />

				{/* Free patterns list */}
				<FreePatternsNode />

				{/* Social network */}
				<SocialNode />

				{/* Blogs */}
				<BlogsNode />
			</Spin>
		</div>
  );
}
