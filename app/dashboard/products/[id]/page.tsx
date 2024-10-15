import ProductForm from "../ProductForm";

export default function UpdateProduct({ params }: { params: { id: string } }){
    return (
        <ProductForm params={params} />
    )
}
