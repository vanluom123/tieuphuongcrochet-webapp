import UserForm from "../UserForm";

export default function UpdateUser({ params }: { params: { id: string } }){
    return (
        <UserForm params={params} />
    )
}