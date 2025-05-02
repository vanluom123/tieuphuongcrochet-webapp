'use client'

import { useState, useEffect } from 'react';
import { Card, Button, Alert, Statistic, message, Flex, Radio, Space, Spin } from 'antd';
import { CrownOutlined, DollarOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { subscribeVip, checkVipStatus } from '@/app/lib/service/vipService';
import { useRouter } from 'next/navigation';

export default function VipSubscriptionPage() {
    const t = useTranslations('Common');
    const [months, setMonths] = useState<number>(1);
    const [isVip, setIsVip] = useState<boolean>(false);
    const [vipLoading, setVipLoading] = useState<boolean>(true);
    const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const checkVip = async () => {
            try {
                const vipStatus = await checkVipStatus();
                setIsVip(vipStatus);
            } catch (error) {
                console.error('Error checking VIP status:', error);
            } finally {
                setVipLoading(false);
            }
        };

        if (session?.user) {
            checkVip();
        } else {
            setVipLoading(false);
        }
    }, [session]);

    const handleSubscribe = async () => {
        if (!session?.user) {
            message.error('Bạn cần đăng nhập để sử dtínhụng  năng này');
            router.push('/login');
            return;
        }

        try {
            setPaymentLoading(true);
            // Trong thực tế, ở đây sẽ tích hợp cổng thanh toán như PayPal hoặc Stripe
            // Giả lập thanh toán thành công
            const paymentSuccessful = true;
            const transactionId = `sim_${Date.now()}`;

            if (paymentSuccessful) {
                await subscribeVip({
                    paymentMethod: 'paypal',
                    months,
                    transactionId
                });
                
                message.success('Đăng ký VIP thành công!');
                setIsVip(true);
            }
        } catch (error) {
            console.error('Error subscribing to VIP:', error);
            message.error('Có lỗi xảy ra khi đăng ký VIP. Vui lòng thử lại sau.');
        } finally {
            setPaymentLoading(false);
        }
    };

    if (vipLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="vip-subscription-page">
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                <CrownOutlined style={{ color: '#FFD700', marginRight: '10px' }} />
                Đăng Ký Tài Khoản VIP
            </h1>

            {isVip && (
                <Alert
                    message="Bạn đã là thành viên VIP"
                    description="Cảm ơn bạn đã ủng hộ website của chúng tôi! Bạn đang được miễn quảng cáo trên toàn bộ trang web."
                    type="success"
                    showIcon
                    style={{ marginBottom: '20px' }}
                />
            )}

            <Card title="Gói VIP" bordered={false} style={{ marginBottom: '20px' }}>
                <p>Với tài khoản VIP, bạn sẽ được:</p>
                <ul>
                    <li>Không hiển thị bất kỳ quảng cáo nào trên toàn bộ trang web</li>
                    <li>Hỗ trợ phát triển nội dung chất lượng</li>
                    <li>Đóng góp vào sự phát triển của cộng đồng</li>
                </ul>

                <Flex justify="center" align="center" style={{ marginTop: '20px' }}>
                    <Statistic 
                        title="Chỉ với"
                        value={months}
                        suffix="USD/tháng"
                        prefix={<DollarOutlined />}
                        style={{ margin: '0 20px' }}
                    />
                </Flex>

                <Space direction="vertical" style={{ width: '100%', marginTop: '20px' }}>
                    <div>Chọn thời hạn đăng ký:</div>
                    <Radio.Group
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        buttonStyle="solid"
                    >
                        <Radio.Button value={1}>1 tháng</Radio.Button>
                        <Radio.Button value={3}>3 tháng</Radio.Button>
                        <Radio.Button value={6}>6 tháng</Radio.Button>
                        <Radio.Button value={12}>1 năm</Radio.Button>
                    </Radio.Group>
                </Space>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<CrownOutlined />}
                        onClick={handleSubscribe}
                        loading={paymentLoading}
                        disabled={isVip}
                    >
                        {isVip ? 'Bạn đã là thành viên VIP' : `Đăng ký VIP - ${months} USD`}
                    </Button>
                </div>
            </Card>

            <Alert
                message="Lưu ý"
                description="Trong bản demo này, bạn có thể đăng ký VIP mà không cần thanh toán thực tế. Trong môi trường thực tế, chúng tôi sẽ tích hợp cổng thanh toán như PayPal hoặc Stripe."
                type="info"
                showIcon
            />
        </div>
    );
} 