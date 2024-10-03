import { generateMetadata } from "./metadata";
import PatternDetail from "./PatternDetail";
export { generateMetadata }

export default function Page({ params }: { params: { slug: string } }){

    return (
        <PatternDetail params={params} />
    )

}