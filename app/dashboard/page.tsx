import Link from "next/link";
import {
  FileOutlined,
  ReadOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { ROUTE_PATH } from "@/app/lib/constant";

const QUICK_SECTIONS = [
  {
    href: ROUTE_PATH.DASHBOARD_FREE_PATTERNS,
    title: "Free Patterns",
    description: "Manage crochet charts and translation status.",
    icon: <ReadOutlined />,
  },
  {
    href: ROUTE_PATH.DASHBOARD_PRODUCTS,
    title: "Products",
    description: "Manage handmade items and store pricing.",
    icon: <ShoppingCartOutlined />,
  },
  {
    href: ROUTE_PATH.DASHBOARD_POSTS,
    title: "Posts",
    description: "Publish craft stories and crochet tutorials.",
    icon: <FileOutlined />,
  },
  {
    href: ROUTE_PATH.DASHBOARD_CATEGORY,
    title: "Categories",
    description: "Organize pattern and shop categories.",
    icon: <UnorderedListOutlined />,
  },
  {
    href: ROUTE_PATH.DASHBOARD_USERS,
    title: "Users",
    description: "View community members and roles.",
    icon: <TeamOutlined />,
  },
  {
    href: ROUTE_PATH.DASHBOARD_SETTING,
    title: "Setting",
    description: "Configure banners, pricing, and video popups.",
    icon: <SettingOutlined />,
  },
];

const Dashboard = () => {
  return (
    <div className="admin-dashboard-home">
      <div className="admin-dashboard-home__header">
        <h1>Tiểu Phương Studio</h1>
        <p>Select a workspace section to manage content and settings.</p>
      </div>
      <div className="admin-dashboard-home__grid">
        {QUICK_SECTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="admin-dashboard-card"
          >
            <span className="admin-dashboard-card__icon">{item.icon}</span>
            <span className="admin-dashboard-card__title">{item.title}</span>
            <span className="admin-dashboard-card__desc">
              {item.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
