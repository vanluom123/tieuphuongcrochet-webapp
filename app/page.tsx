
import Home from './components/home/Home';
import { fetchHomeData } from './lib/service/homeService';
import './ui/home.scss';

export default async function Page() {
	const { blogs, freePatterns, products } = await fetchHomeData();

	return (
		<Home blogs={blogs} freePatterns={freePatterns} products={products} />
	);
}
