import CollectionDetail from "./collection-detail";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    return (
        <>
            <CollectionDetail params={resolvedParams} />
        </>
    )

}