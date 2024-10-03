import { memo, useEffect, useState } from "react";
import { ROUTE_PATH } from "@/app/lib/constant";
import { usePathname } from "next/navigation";
import BannersList from "./Banners";
import BreadCrumbs from "./BreadCrumbs";
import { fetchHomeData } from "@/app/lib/service/homeService";
import { Banner } from "@/app/lib/definitions";

const CoverPage = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        fetchHomeData().then((data) => {
            setBanners(data.banners || []);
        });
    }, []); 

    if (pathname === ROUTE_PATH.HOME) {
        return <BannersList banners={banners} />;
    }
    
    return <BreadCrumbs pathname={pathname} banners={banners}/>;
};

export default memo(CoverPage);