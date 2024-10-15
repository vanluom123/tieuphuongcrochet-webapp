import FreePatternForm from "../FreePatternForm";

export default function UpdateFreePattern({ params }: { params: { id: string } }){
    return (
        <FreePatternForm params={params} />
    )
}
