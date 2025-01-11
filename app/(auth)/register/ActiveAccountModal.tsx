'use client'
import { Button, Modal } from "antd";
import { useTranslations } from "next-intl";
import React from "react";

interface ActiveAccountModalProps {
    isOpen: boolean;
    onClick: () => void;
    onCancel: () => void;
}

const ActiveAccountModal: React.FC<ActiveAccountModalProps> = ({ isOpen, onClick, onCancel }) => {
    const t = useTranslations('Register.ActiveModal');

    if (!isOpen) {
        return null;
    }

    return (

        <Modal
            title={t('title') || 'Activate Account'}
            open={isOpen}
            onCancel={onCancel}
            footer={
                <Button className="btn-border" type="primary" onClick={onClick}>
                    {t('btn_sign_in') || 'Sign In'}
                </Button>
            }
        >
            <p>{t('description')}</p>
        </Modal>
    );
};

export default ActiveAccountModal;