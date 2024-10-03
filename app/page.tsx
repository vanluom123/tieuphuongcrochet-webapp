'use client'
import { Spin } from 'antd';
import FreePatternsNode from './components/home/FreePatternsNode';
import ProductsNode from './components/home/ProductsNode';
import BlogsNode from './components/home/BlogsNode';
import SocialNode from './components/home/SocialNode';
import './ui/home.scss';
import { fetchHomeData } from './lib/service/homeService';
import { useEffect, useState } from 'react';
import { HomeData } from './lib/definitions';
import { animationHome } from './lib/utils';

interface HomeState extends HomeData {
	loading: boolean,
};

const initialState: HomeState = {
	loading: false,
	blogs: [],
	freePatterns: [],
	banners: [],
	products: [],
};

export default function Home() {
	const [state, setState] = useState(initialState);
	
	useEffect(() => {
		setState({ ...state, loading: true });
		fetchHomeData().then((data) => {
			setState({
				...state,
				...data
			})
		}).finally(() => {
			setState(prevState => ({ ...prevState, loading: false }));
		});;
		const reset = animationHome();
		return () => {
			reset();
		}
	}, []);

	return (
		<div className='home-page'>
			<Spin spinning={state.loading} tip="Loading...">
				{/* Product list */}
				<ProductsNode products={state.products || []} />

				{/* Free patterns list */}
				<FreePatternsNode patterns={state.freePatterns || []} />

				{/* Social network */}
				<SocialNode />

				{/* Blogs */}
				<BlogsNode posts={state.blogs || []} />
			</Spin>
		</div>
	);
}
