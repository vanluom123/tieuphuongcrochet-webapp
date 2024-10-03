import ProductDetail from "./ProductDetail";

export {generateMetadata} from './metadata'

export default function Page({ params }: { params: { slug: string } }) {
    
    return (
        <ProductDetail params={params} />
    )
}