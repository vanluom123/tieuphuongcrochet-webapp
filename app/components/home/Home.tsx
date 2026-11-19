"use client";

import { Product, Pattern, Post } from "@/app/lib/definitions";
import BlogsNode from "./BlogsNode";
import FreePatternsNode from "./FreePatternsNode";
import ProductsNode from "./ProductsNode";
import SocialNode from "./SocialNode";
import "../../ui/home.scss";

interface HomeProps {
  products: Product[];
  freePatterns: Pattern[];
  blogs: Post[];
}

export default function Home({ products, freePatterns, blogs }: HomeProps) {
  return (
    <div className="home-page">
      <FreePatternsNode patterns={freePatterns || []} />
      <ProductsNode products={products || []} />
      <BlogsNode posts={blogs || []} />
      <SocialNode />
    </div>
  );
}
