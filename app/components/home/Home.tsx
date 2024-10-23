'use client'
import { Product, Pattern, Post } from '@/app/lib/definitions';
import { animationHome } from '@/app/lib/utils';
import { useEffect } from 'react';
import BlogsNode from './BlogsNode';
import FreePatternsNode from './FreePatternsNode';
import ProductsNode from './ProductsNode';
import SocialNode from './SocialNode';
import '../../ui/home.scss';

interface HomeProps {
    products: Product[],
    freePatterns: Pattern[],
    blogs: Post[],
}

export default function Home({ products, freePatterns, blogs }: HomeProps) {

    useEffect(() => {
        const reset = animationHome();
        return () => {
            reset();
        }
    }, []);

    return (
        <div className='home-page'>
            {/* Product list */}
            <ProductsNode products={products || []} />

            {/* Free patterns list */}
            <FreePatternsNode patterns={freePatterns || []} />

            {/* Social network */}
            <SocialNode />

            {/* Blogs */}
            <BlogsNode posts={blogs || []} />
        </div>
    );
}
