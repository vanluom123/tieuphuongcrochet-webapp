import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FreePatterns from "./FreePatterns";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('FreePattern');
	return {
		title: t('title'),
		description: t('description')
	};
}
const FreePattern = () => {
    
    return(
       <FreePatterns />
    )
}

export default FreePattern;