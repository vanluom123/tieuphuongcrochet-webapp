import FreePatternForm from "../FreePatternForm";

export default async function UpdateFreePattern({ params }: { params: Promise<{ id: string }> }){
    const resolvedParams = await params;
    return (
        <FreePatternForm params={resolvedParams} />
    )
}
