import { Row, Col, Image } from "antd";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import coverImg from "@/public/about.jpg";
import { ROUTE_PATH } from "@/app/lib/constant";
import StructuredData, {
  createAboutPageSchema,
} from "@/app/components/StructureData";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  return {
    title: t("title"),
    description: t("description"),

    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${process.env.NEXT_PUBLIC_URL}${ROUTE_PATH.ABOUT}`,
    },
  };
}

const About = async () => {
  const t = await getTranslations("About");
  return (
    <>
      <StructuredData
        data={createAboutPageSchema({
          title: t("title"),
          description: t("description"),
        })}
      />
      <section className="about-page">
        <Row gutter={[40, 28]} align="middle">
          <Col xs={24} md={13}>
            <h1 className="content-title">{t("message")}</h1>
            <p className="content-text">{t("content")}</p>
          </Col>
          <Col xs={24} md={11}>
            <div className="about-image-frame">
              <Image
                className="img-about"
                src={coverImg.src}
                alt={t("title")}
              />
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default About;
