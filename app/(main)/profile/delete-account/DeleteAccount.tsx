'use client';

import { Alert, Button, Checkbox, Flex, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { notification } from '@/app/lib/notify';
import { ROUTE_PATH } from '@/app/lib/constant';

const { Title, Text } = Typography;

const DeleteAccount = () => {
    const t = useTranslations('Profile');
    const router = useRouter();
    const [confirmDownload, setConfirmDownload] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        if (!confirmDownload || !confirmDelete) {
            notification.error({
                message: t('delete_account.error'),
                description: t('delete_account.check_confirmations')
            });
            return;
        }

        setLoading(true);
        try {
            // Gọi API xóa tài khoản
            // await deleteAccount();
            
            // Đăng xuất và chuyển về trang chủ
            await signOut({ callbackUrl: ROUTE_PATH.HOME });
            
            notification.success({
                message: t('delete_account.success'),
                description: t('delete_account.success_description')
            });
        } catch (error) {
            notification.error({
                message: t('delete_account.error'),
                description: t('delete_account.error_description')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-account-page container">
            <Flex vertical gap={24}>
                <Title level={2}>{t('delete_account.title')}</Title>
                
                <Alert
                    type="warning"
                    showIcon
                    message={t('delete_account.warning_title')}
                    description={t('delete_account.warning_description')}
                />

                <Space direction="vertical">
                    <Title level={4}>{t('delete_account.what_happens')}</Title>
                    <Text>{t('delete_account.consequence_1')}</Text>
                    <Text>{t('delete_account.consequence_2')}</Text>
                    <Text>{t('delete_account.consequence_3')}</Text>
                    <Text>{t('delete_account.consequence_4')}</Text>
                </Space>

                <Space direction="vertical">
                    <Checkbox 
                        checked={confirmDownload}
                        onChange={(e) => setConfirmDownload(e.target.checked)}
                    >
                        {t('delete_account.confirm_download')}
                    </Checkbox>
                    <Checkbox
                        checked={confirmDelete}
                        onChange={(e) => setConfirmDelete(e.target.checked)}
                    >
                        {t('delete_account.confirm_delete')}
                    </Checkbox>
                </Space>

                <Flex gap={16}>
                    <Button 
                        type="primary" 
                        danger
                        loading={loading}
                        onClick={handleDeleteAccount}
                        disabled={!confirmDownload || !confirmDelete}
                    >
                        {t('delete_account.delete_button')}
                    </Button>
                    <Button onClick={() => router.back()}>
                        {t('delete_account.cancel_button')}
                    </Button>
                </Flex>
            </Flex>
        </div>
    );
};

export default DeleteAccount;