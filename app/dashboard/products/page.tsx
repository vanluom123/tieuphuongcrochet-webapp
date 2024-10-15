import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Products from "./Products";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Product');
    return {
        title: t('title'),
        description: t('description')
    };
}

const Product = () => {
    
    return(
        <Products />
    )
}

export default Product;