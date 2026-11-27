import UserForm from "../UserForm";

export default async function UpdateUser({ params }: { params: Promise<{ id: string }> }){
    const resolvedParams = await params;
    return (
        <UserForm params={resolvedParams} />
    )
}