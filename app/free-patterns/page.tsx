import { getTranslations } from "next-intl/server";

export async function generateMetadata() {

    const t = await getTranslations("FreePattern");

    return {
        title: t("title"),
        description: t("description")
    }
}

const FreePattern = () => {

    return (
        <div> Free pattern</div>
    )
}

export default FreePattern;