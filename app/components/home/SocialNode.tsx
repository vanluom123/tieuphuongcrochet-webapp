import { Col, Row } from "antd";
import HeaderPart from "../header-part";
import { SOCIALS } from "@/app/lib/constant";
import SocialBox from "../social-box";

const SocialNode = () => {
    return (
        <div className='social'>
            <HeaderPart
                isShowDivider
                titleId='Home.Social.title'
                descriptionId='Home.Social.description' />
            <Row className='justify-center' gutter={[{ xs: 36, md: 16, lg: 48 }, { xs: 36, md: 16, lg: 48 }]}>
                {(SOCIALS || []).map(({ social, src, url, ...rest }, index) =>
                    <Col key={`home_social_${index}`} xs={12} md={6}>
                        <SocialBox social={social} src={src} url={url} {...rest} />
                    </Col>
                )}
            </Row>
        </div>
    )
}

export default SocialNode;