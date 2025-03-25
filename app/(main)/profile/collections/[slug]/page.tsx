import CollectionDetail from "./collection-detail";

export default async function Page({ params }: { params: { slug: string } }) {

    return (
        <>
            <CollectionDetail params={params} />
        </>
    )

}