"use client"
import { Image, Modal, Space, Typography } from 'antd';
import { DollarOutlined, HeartOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

const { Title, Paragraph } = Typography;

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
      style={{ maxWidth: 500 }}
      centered
      className="donate-modal"
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            <HeartOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            {t('title')}
          </Title>
        </div>
      }
    >
      <div style={{ padding: '0 10px' }}>
        <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
          {t('message')}
        </p>
        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 16 }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* <Button 
              type="primary" 
              size="large" 
              icon={<DollarOutlined />} 
              style={{ 
                height: 50, 
                fontSize: 18, 
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f'
              }}
              onClick={() => window.open('https://www.paypal.com', '_blank')}
            >
              Ủng hộ qua PayPal
            </Button> */}
            <div style={{ marginTop: 16 }}>
              {/* <Text style={{ fontSize: 16, color: '#888', display: 'block', marginBottom: 12 }}>{t('or')}</Text> */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Image
                  src="/donate-qr-702.png"
                  alt="QR Payment"
                  width='180px'
                  height='auto'
                  style={{ margin: '0 auto 16px' }}
                  preview={false}
                />
                <Paragraph style={{ textAlign: 'center', fontWeight: 'bold', margin: 0 }}>
                  <span style={{ fontSize: 18, color: '#5e35b1', display: 'block', marginBottom: 8 }}>DO THI THAM PHUONG</span>
                  <span style={{ fontSize: 18, display: 'block' }}>0331 2912 702</span>
                  <span style={{ fontSize: 14, color: '#666', display: 'block', marginTop: 8 }}>TPBank | VietQR</span>
                </Paragraph>
              </div>
            </div>
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
