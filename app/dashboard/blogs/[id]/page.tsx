import BlogForm from "../BlogForm";

export default function UpdateBlog({ params }: { params: { id: string } }){
    return (
        <BlogForm params={params} />
    )
}
