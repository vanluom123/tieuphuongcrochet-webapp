import BlogForm from "../BlogForm";

export default async function UpdateBlog({ params }: { params: Promise<{ id: string }> }){
    const resolvedParams = await params;
    return (
        <BlogForm params={resolvedParams} />
    )
}
