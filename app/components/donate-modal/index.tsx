"use client"
import {Divider, Image, Modal, Space, Typography} from 'antd';
import { DollarOutlined, HeartOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import PayPalDonateButton from "@/app/components/donate-modal/PayPalDonateButton";
import QRDonate from "@/app/components/donate-modal/QRDonate";

const { Title, Paragraph, Text } = Typography;

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('DonateModal');
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className="donate-modal"
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} className='donate-modal-title'>
            <HeartOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            {t('title')}
          </Title>
        </div>
      }
    >
      <div style={{ padding: '0 10px' }}>
        <p className='donate-modal-message'>
          {t('message')}
        </p>
        <div className='donate-modal-content'>
          <Space direction="vertical" style={{ width: '100%' }}>
            <PayPalDonateButton />
            <Divider type="horizontal">
              <Text style={{ fontSize: 16, color: '#888', display: 'block'}}>{t('or')}</Text>
            </Divider>
            <QRDonate />
          </Space>
        </div>

        <Paragraph style={{ textAlign: 'center', fontSize: 14, fontStyle: 'italic', marginTop: 16 }}>
          {t('thanks')}❤️<br />
          <strong>{t('web_title')}</strong>
        </Paragraph>
      </div>
    </Modal>
  );
};

export default DonateModal;
