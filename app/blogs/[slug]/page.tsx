import ViewPost from "./ViewPost";

export { generateMetadata } from './metadata';

export default function Page({ params }: { params: { slug: string } }) {

	return (
		<ViewPost params={params} />
	)
}