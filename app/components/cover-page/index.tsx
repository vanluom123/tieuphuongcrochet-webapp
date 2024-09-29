import { ROUTE_PATH } from "@/app/lib/constant";
import { usePathname } from "next/navigation";
import BannersList from "./Banners";
import BreadCrumbs from "./BreadCrumbs";
import { memo } from "react";
import { Banner } from "@/app/lib/definitions";

// Mock banner data
const mockBanners: Banner[] = [
    {
      fileContent: 'base64encodedstring1',
      fileName: 'home_banner_1.jpg',
      title: 'Summer Sale',
      content: 'Up to 50% off on all items',
      url: '/summer-sale',
      bannerTypeId: 'home',
      active: true,
      id: '1',
      textColor: '#ffffff'
    },
    {
      fileContent: 'base64encodedstring2',
      fileName: 'new_arrivals.png',
      title: 'New Arrivals',
      url: '/new-arrivals',
      bannerTypeId: 'home',
      active: true,
      id: '2',
      textColor: '#000000'
    },
    {
      fileContent: 'base64encodedstring3',
      fileName: 'category_electronics.jpg',
      title: 'Electronics Deals',
      content: 'Best deals on electronics',
      url: '/category/electronics',
      bannerTypeId: 'category',
      active: false,
      id: '3',
      textColor: '#333333'
    }
  ];

const CoverPage = () => {
    const pathname = usePathname();
    
    if (pathname === ROUTE_PATH.HOME) {
        return <BannersList banners={mockBanners} />;
    }
    
    return <BreadCrumbs pathname={pathname} banners={mockBanners}   />;
};

export default memo(CoverPage);