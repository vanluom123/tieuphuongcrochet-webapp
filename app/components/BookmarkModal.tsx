'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Modal, List, Button, Input, Form, Spin, Empty, message } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';
import { fetchUserCollections, createCollection } from '@/app/lib/service/profileService';
import { Collection } from '@/app/lib/definitions';
import { useTranslations } from 'next-intl';
import { savePatternToCollection } from '../lib/service/collectionService';
import { useSession } from 'next-auth/react';
import { useBookmarkModal } from '@/app/context/BookmarkModalContext';

interface BookmarkModalProps {
    open: boolean;
    onClose: () => void;
    patternId: string;
    onSuccess: () => void;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({ open, onClose, patternId, onSuccess }) => {
    const t = useTranslations('Common');
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(false);
    const [createMode, setCreateMode] = useState(false);
    const [form] = Form.useForm();
    const [savingId, setSavingId] = useState<string | null>(null);
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { notifyCollectionChange, collectionChanged } = useBookmarkModal();

    // Tải danh sách bộ sưu tập với caching
    const loadCollections = useCallback(async () => {
        if (!userId) {
            message.error(t('please_login_first'));
            onClose();
            return;
        }

        setLoading(true);
        try {
            const userCollections = await fetchUserCollections(userId);
            setCollections(userCollections);
        } catch (error) {
            message.error(t('error_loading_collections'));
        } finally {
            setLoading(false);
        }
    }, [userId, t, onClose]);

    // Load collections khi mở modal hoặc khi có thay đổi
    useEffect(() => {
        if (open && userId) {
            loadCollections();
        }
    }, [open, userId, loadCollections]);

    // Khi collectionChanged thay đổi, làm mới danh sách bộ sưu tập
    useEffect(() => {
        if (open && userId) {
            loadCollections();
        }
    }, [collectionChanged, open, userId, loadCollections]);

    const handleCreateCollection = async (values: { name: string }) => {
        if (!userId) {
            message.error(t('please_login_first'));
            return;
        }

        setLoading(true);
        try {
            const response = await createCollection(values.name);
            if (response.success) {
                message.success(t('collection_created'));
                form.resetFields();
                setCreateMode(false);
                await loadCollections();
                notifyCollectionChange();
            } else {
                message.error(response.message || t('create_collection_error'));
            }
        } catch (error) {
            message.error(t('create_collection_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToCollection = async (collectionId: string) => {
        if (!userId) {
            message.error(t('please_login_first'));
            return;
        }

        setSavingId(collectionId);
        try {
            const response = await savePatternToCollection(patternId, collectionId);
            if (response.success) {
                message.success(t('pattern_saved_to_collection'));
                onSuccess();
                setTimeout(() => {
                    onClose();
                }, 50);
                notifyCollectionChange();
            } else {
                message.error(response.message || t('save_pattern_error'));
            }
        } catch (error) {
            message.error(t('save_pattern_error'));
        } finally {
            setSavingId(null);
        }
    };

    if (!userId) {
        return (
            <Modal
                title={t('save_to_collection')}
                open={open}
                onCancel={onClose}
                footer={[
                    <Button key="login" type="primary" onClick={() => {
                        window.location.href = '/login';
                    }}>
                        {t('login_to_save')}
                    </Button>
                ]}
                centered
            >
                <p>{t('please_login_to_save_patterns')}</p>
            </Modal>
        );
    }

    return (
        <Modal
            title={t('save_to_collection')}
            open={open}
            onCancel={onClose}
            footer={null}
            centered
        >
            <Spin spinning={loading}>
                {createMode ? (
                    <Form
                        form={form}
                        onFinish={handleCreateCollection}
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            label={t('collection_name')}
                            rules={[{ required: true, message: t('please_enter_collection_name') }]}
                        >
                            <Input placeholder={t('enter_collection_name')} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {t('create')}
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={() => setCreateMode(false)}>
                                {t('cancel')}
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => setCreateMode(true)}
                            style={{ marginBottom: 16, width: '100%' }}
                        >
                            {t('create_new_collection')}
                        </Button>

                        <Button
                            onClick={() => loadCollections()}
                            style={{ marginBottom: 16 }}
                        >
                            {t('refresh')}
                        </Button>

                        {collections.length === 0 ? (
                            <Empty description={t('no_collections')} />
                        ) : (
                            <List
                                dataSource={collections}
                                renderItem={(collection) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key="save"
                                                type="primary"
                                                onClick={() => handleSaveToCollection(collection.id!)}
                                                loading={savingId === collection.id}
                                            >
                                                {t('save')}
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<BookOutlined />}
                                            title={collection.name}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </>
                )}
            </Spin>
        </Modal>
    );
};

export default BookmarkModal; 