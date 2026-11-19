import { Col, Row } from "antd";
import HeaderPart from "../header-part";
import { SOCIALS } from "@/app/lib/constant";
import SocialBox from "../social-box";

const SocialNode = () => {
  return (
    <section className="social home-section">
      <HeaderPart
        isShowDivider
        titleId="Home.Social.title"
        descriptionId="Home.Social.description"
      />
      <Row gutter={[{ xs: 12, md: 16, xl: 20 }, { xs: 12, md: 16 }]}>
        {(SOCIALS || []).map(({ social, src, url, ...rest }, index) => (
          <Col key={`home_social_${index}`} xs={24} sm={12} lg={6}>
            <SocialBox social={social} src={src} url={url} {...rest} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default SocialNode;
