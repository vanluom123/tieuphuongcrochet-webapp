import ProductForm from "../ProductForm";

export default async function UpdateProduct({ params }: { params: Promise<{ id: string }> }){
    const resolvedParams = await params;
    return (
        <ProductForm params={resolvedParams} />
    )
}
