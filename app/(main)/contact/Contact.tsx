"use client";
import React from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Space,
} from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import emailjs from "@emailjs/browser";
import SocialBox from "@/app/components/social-box";
import { REGEX, SOCIALS } from "@/app/lib/constant";
import { useTranslations } from "next-intl";
import "../../ui/contact.scss";
import StructuredData, {
  createContactPageSchema,
} from "@/app/components/StructureData";

const Contact = () => {
  const service_ID = "service_7v8jlqr";
  const template_ID = "template_usd1qy4";
  const public_KEY = "FUxGmh_olTTCGh57P";
  const [form] = Form.useForm();

  const t = useTranslations("Contact");

  interface ContactFormValues {
    name: string;
    email: string;
    subject: string;
    content: string;
  }

  const onSendEmail = (value: ContactFormValues) => {
    const templateParams = {
      from_name: value.name,
      from_email: value.email,
      message: value.content,
      subject: value.subject.toUpperCase(),
    };

    emailjs.send(service_ID, template_ID, templateParams, public_KEY).then(
      () => {
        notification.success({
          message: t("Form.success"),
          description: t("Form.success"),
        });

        form.resetFields();
      },
      () => {
        notification.error({
          message: t("Form.error"),
          description: t("Form.error"),
        });
      }
    );
  };

  const contactSchema = createContactPageSchema({
    title: t("title"),
    description: t("description"),
    phone: "0969545937",
    email: "thamphuong.crochet@gmail.com",
  });

  return (
    <>
      <StructuredData data={contactSchema} />
      <Space direction="vertical" size={40} style={{ width: "100%" }}>
        <section className="contact-page">
          <Row gutter={[36, 28]} align="top">
            <Col xs={24} md={11}>
              <div className="contact-intro">
                <h1 className="content-title">{t("title")}</h1>
                <p className="content-text">{t("description")}</p>

                <div className="contact-direct-card">
                  <div className="contact-direct-card__item">
                    <MailOutlined className="contact-direct-card__icon" />
                    <a href="mailto:thamphuong.crochet@gmail.com">
                      thamphuong.crochet@gmail.com
                    </a>
                  </div>
                  <div className="contact-direct-card__item">
                    <PhoneOutlined className="contact-direct-card__icon" />
                    <a href="tel:0969545937">0969545937</a>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} md={13}>
              <div className="form-contact">
                <h2 className="form-contact__title">{t("Form.title")}</h2>
                <Form
                  name="contactForm"
                  form={form}
                  layout="vertical"
                  onFinish={onSendEmail}
                >
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: t("Form.input_name"),
                      },
                    ]}
                  >
                    <Input placeholder={t("Form.input_name")} />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: t("Form.input_email"),
                      },
                      {
                        pattern: new RegExp(REGEX.EMAIL),
                        message: t("Form.error_msg_incorrect_email"),
                      },
                    ]}
                  >
                    <Input placeholder={t("Form.input_email")} />
                  </Form.Item>
                  <Form.Item
                    name="subject"
                    rules={[
                      {
                        required: true,
                        message: t("Form.input_title"),
                      },
                    ]}
                  >
                    <Input placeholder={t("Form.input_title")} />
                  </Form.Item>
                  <Form.Item
                    name="content"
                    rules={[
                      {
                        required: true,
                        message: t("Form.input_content"),
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder={t("Form.input_content")}
                    />
                  </Form.Item>
                  <div className="form-contact__submit">
                    <Button
                      className="btn-border"
                      type="primary"
                      htmlType="submit"
                      block
                    >
                      {t("Form.btn_send")}
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </section>

        <section className="contact-social-section">
          <hr className="yarn-divider" style={{ marginTop: 0 }} />
          <h2 className="contact-social-section__title">{t("Form.via")}</h2>
          <Row gutter={[{ xs: 12, md: 16, xl: 20 }, { xs: 12, md: 16 }]}>
            {(SOCIALS || []).map(({ social, src, url, ...rest }, index) => (
              <Col key={`social_${index}`} xs={24} sm={12} lg={6}>
                <SocialBox social={social} src={src} url={url} {...rest} />
              </Col>
            ))}
          </Row>
        </section>
      </Space>
    </>
  );
};

export default Contact;
