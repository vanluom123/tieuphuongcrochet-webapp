'use client'
import { Form, Button, Space, Divider, List, Collapse, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { filter, find } from "lodash";
import { useRouter } from "next/navigation";
import BannerItem from "@/app/components/cover-page/BannerItem";
import { Banner, FileUpload, IBannerType, DataType } from "@/app/lib/definitions";
import { uid } from "@/app/lib/utils";
import BannerType from "./BannerType";
import BannerForm, { EdittingBanner, initialEdittingBanner } from "./BannerForm";
import { createUpdateBanners, fetchBanners, fetchBannerTypes } from "@/app/lib/service/settingService";

const Setting = () => {
    const [isUpdatedBList, setIsUpdatedBList] = useState(false);
    const [edittingBanner, setEdittingBanner] = useState<EdittingBanner>(initialEdittingBanner);
    const [bannersList, SetBannersList] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(false);
    const [bannerTypes, setBannerTypes] = useState<DataType[]>([]);
    const bannerRef = useRef<Banner[]>([]);

    const [form] = Form.useForm();
    const { Item } = Form;
    const { Title } = Typography;
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchBannerTypes(),
            fetchBanners()
        ]).then(([bannerTypes, banners]) => {
            setBannerTypes(bannerTypes);
            SetBannersList(banners);
            bannerRef.current = banners;
        }).finally(() => {
            setLoading(false);
        })
    }, [])

    const handleRefreshBannerTypes = async () => {
        const bannerTypes = await fetchBannerTypes();
        setBannerTypes(bannerTypes);
    }

    const handleRefreshBanners = async () => {
        const banners = await fetchBanners();
        SetBannersList(banners);
    }

    const onSubmitForm = async () => {
        await createUpdateBanners(bannersList);
        setIsUpdatedBList(false);
    }

    const onCancel = () => {
        form.resetFields();
        router.back();
    }

    const onEditBanner = (banner: Banner, index: number) => {
        const bannerImage: FileUpload[] = [{
            fileContent: banner.fileContent,
            fileName: banner.fileName,
            url: banner.fileContent,
            name: banner.fileName,
            uid: banner.id || uid()
        }];

        setEdittingBanner({
            isEditting: true,
            index,
            image: bannerImage,
            banner
        });
    }

    const onDeleteBanner = (index: number) => {
        const newBannerList = filter([...bannerRef.current], (_, i) => i !== index);
        SetBannersList(newBannerList);
        setIsUpdatedBList(true);
    }

    const validateBanners = () => {
        if (bannersList.length > 0) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Phải có ít nhất 1 banner'));
    };

    const getBannerType = (id?: string, bannerType?: IBannerType) => {
        return id ? find(bannerTypes, bt => bt.key === id)?.name : bannerType?.name;
    };

    const getActiveKey = () => {
        return edittingBanner.isEditting ?
            { activeKey: ['bannerItem'] } :
            { defaultActiveKey: [] }
    }

    return (<>
        <div className="setting-page">
            <BannerType
                bannerTypes={bannerTypes}
                onRefresh={handleRefreshBannerTypes}
                loading={loading}
            />
            <Divider style={{ margin: '30px 0' }} />
            <Title level={2} className="align-center">Banners</Title>
            <Collapse
                expandIconPosition='end'
                {...getActiveKey()}
                items={[
                    {
                        key: 'bannerItem',
                        label: 'Thêm/Sửa Banner',
                        children:
                            <BannerForm
                                bannerTypes={bannerTypes}
                                bannersList={bannersList}
                                edittingBanner={edittingBanner}
                                setEdittingBanner={setEdittingBanner}
                                SetBannersList={SetBannersList}
                                setIsUpdatedBList={setIsUpdatedBList}
                                onRefresh={handleRefreshBanners}
                            />
                    }]}
            />
            <Form layout="vertical"
                name='CUSettingForm'
                form={form}
                onFinish={onSubmitForm}
                className="form-wrap"
            >

                <Item name='bannersList'
                    label='Danh sách banner'
                    rules={[
                        { validator: () => validateBanners() }
                    ]}
                >
                    <List
                        loading={loading}
                        itemLayout="vertical"
                        size="large"
                        dataSource={bannersList}
                        renderItem={(item, index) => (
                            <List.Item
                                key={`banner-item__${index}`}
                                extra={
                                    <div style={{ width: '320px', height: '180px', overflow: 'hidden' }}>
                                        <BannerItem banner={item} classNames="banner-item__preview" />
                                    </div>
                                }
                                actions={[
                                    <Button
                                        onClick={() => onEditBanner(item, index)}
                                        shape="circle"
                                        key="list-vertical-edit"
                                        icon={<EditOutlined />}
                                        disabled={edittingBanner.isEditting}
                                        title="Sửa"
                                    />,
                                    <Button
                                        shape="circle"
                                        key="list-vertical-delete"
                                        icon={<DeleteOutlined />}
                                        disabled={edittingBanner.isEditting}
                                        onClick={() => onDeleteBanner(index)}
                                        title="Xóa"
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.title}
                                    description={getBannerType(item.bannerTypeId, item.bannerType)}
                                />
                                {item.content}
                            </List.Item>
                        )}
                    />
                </Item>
                <div className="align-center">
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={edittingBanner.isEditting || !isUpdatedBList}
                            className="btn-form btn-border"
                        >
                            Lưu thay đổi
                        </Button>
                        <Button
                            disabled={edittingBanner.isEditting || !isUpdatedBList}
                            className="btn-form btn-border"
                            onClick={onCancel}>Hủy bỏ</Button>
                    </Space>
                </div>
            </Form>
        </div>
    </>)
}

export default Setting;
