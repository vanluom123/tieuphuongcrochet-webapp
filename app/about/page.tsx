import { Row, Col, Image } from "antd";
import { getTranslations } from "next-intl/server";
import coverImg from '@/public/about.jpg';
import { ROUTE_PATH } from "../lib/constant";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("About");
	return {
		title: t("title"),
		description: t("description"),

		openGraph: {
			title: t("title"),
			description: t("description"),
			url: `${process.env.NEXT_PUBLIC_URL}/${ROUTE_PATH.ABOUT}`,
		},
	};
}

const About = async () => {

    const t = await getTranslations("About");
    return (
      <div className="about-page scroll-animate">
        <div className='animation-wrap'>
          <h1 className="content-title align-center">
            {t('message')}
          </h1>
        </div>
        <Row gutter={50}>
          <Col xs={24} md={12}>
            <p className="content-text">{t('content')}</p>
          </Col>
          <Col xs={24} md={12} className='animation-wrap'>
            <Image className='img-about' src={coverImg.src} alt='cover' />
          </Col>
        </Row>
      </div>
    );
  };
  
  export default About;