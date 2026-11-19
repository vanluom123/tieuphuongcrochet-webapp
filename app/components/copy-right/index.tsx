import {
  FacebookOutlined,
  InstagramOutlined,
  ShoppingOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/app/lib/constant";

const SocialLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <Link
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    aria-label={label}
    className="social-pill"
  >
    {icon}
  </Link>
);

const TikTokIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3Z" />
  </svg>
);

const CopyRight = () => (
  <div className="copyright-wrap">
    <p className="copyright">
      Tiểu Phương Crochet © {new Date().getFullYear()}, Lượm &amp; Phương
    </p>
    <div className="social-link">
      <SocialLink
        href={SOCIAL_LINKS.FACEBOOK}
        label="Facebook"
        icon={<FacebookOutlined style={{ fontSize: 17 }} />}
      />
      <SocialLink
        href={SOCIAL_LINKS.INSTAGRAM}
        label="Instagram"
        icon={<InstagramOutlined style={{ fontSize: 17 }} />}
      />
      <SocialLink
        href={SOCIAL_LINKS.TIKTOK}
        label="TikTok"
        icon={<TikTokIcon />}
      />
      <SocialLink
        href={SOCIAL_LINKS.YOUTUBE}
        label="YouTube"
        icon={<YoutubeOutlined style={{ fontSize: 18 }} />}
      />
      <SocialLink
        href={SOCIAL_LINKS.SOPEE}
        label="Shopee"
        icon={<ShoppingOutlined style={{ fontSize: 17 }} />}
      />
    </div>
  </div>
);

export default CopyRight;
