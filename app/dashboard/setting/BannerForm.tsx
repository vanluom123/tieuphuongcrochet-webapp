import {
  Button,
  Col,
  ColorPicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { map } from 'lodash'
import { memo, useEffect } from 'react'
import UploadFiles from '@/app/components/upload-files'
import { Banner, DataType, FileUpload } from '@/app/lib/definitions'
import { uploadMultipleImagesToServer } from '@/app/lib/utils'

export interface EdittingBanner {
  isEditting: boolean
  index: number
  image: FileUpload[]
  banner: Banner
}

export const initialEdittingBanner: EdittingBanner = {
  isEditting: false,
  index: -1,
  image: [] as FileUpload[],
  banner: {} as Banner,
}

interface BannerItemProps {
  bannersList: Banner[]
  SetBannersList: (value: Banner[]) => void
  edittingBanner: EdittingBanner
  setEdittingBanner: (value: EdittingBanner) => void
  setIsUpdatedBList: (value: boolean) => void
  bannerTypes: DataType[]
  onRefresh: () => void
}

const BannerForm = ({
  bannerTypes,
  bannersList,
  edittingBanner,
  setEdittingBanner,
  SetBannersList,
  setIsUpdatedBList,
  onRefresh,
}: BannerItemProps) => {
  const [form] = Form.useForm()
  const { Item } = Form
  const { Text } = Typography

  useEffect(() => {
    if (edittingBanner.isEditting) {
      const { banner, image } = edittingBanner
      form.setFieldsValue({
        title: banner.title,
        content: banner.content,
        url: banner.url,
        bannerTypeId: banner.bannerTypeId,
        bannerImage: image,
        active: banner.active,
        textColor: banner.textColor,
      })
    }
  }, [edittingBanner, form])

  const onAddBanner = async (values: any) => {
    const { title, content, url, bannerImage, bannerTypeId, active, textColor } = values

    let fileContent = bannerImage[0]?.fileContent || bannerImage[0]?.url || ''
    let fileName = bannerImage[0]?.fileName || bannerImage[0]?.name || ''

    if (bannerImage[0]?.originFileObj) {
      const uploadedFiles = await uploadMultipleImagesToServer(bannerImage, [], 'banners')
      if (!uploadedFiles || uploadedFiles.length === 0) {
        notification.error({ message: 'Error', description: 'Failed to upload image' })
        return
      }
      fileContent = uploadedFiles[0].fileContent
      fileName = uploadedFiles[0].fileName
    }

    const banner: Banner = {
      title,
      content,
      url,
      bannerTypeId,
      active,
      textColor: typeof textColor === 'string' ? textColor : textColor?.toHexString(),
      fileContent,
      fileName,
    }

    let tempBanners = [...bannersList]
    if (edittingBanner.isEditting) {
      tempBanners.splice(edittingBanner.index, 1, banner)
      setEdittingBanner(initialEdittingBanner)
    } else {
      tempBanners = [...tempBanners, banner]
    }

    setIsUpdatedBList(true)
    SetBannersList(tempBanners)
    form.resetFields()
  }

  const onCancel = () => {
    if (edittingBanner.isEditting) {
      setEdittingBanner(initialEdittingBanner)
    }
    form.resetFields()
  }

  return (
    <Form
      name="bannerItemForm"
      layout="vertical"
      onFinish={onAddBanner}
      form={form}
      initialValues={{
        textColor: '#FFFFFF',
        active: true,
        bannerTypeId: '',
        bannerImage: [],
        title: '',
        content: '',
        url: '',
      }}
    >
      <Row gutter={[30, 30]}>
        <Col xs={24} md={10}>
          <Item
            name="bannerImage"
            label={
              <>
                Banner Image: <Text type="secondary">(Tỷ lệ 16:9 để hiển thị tốt nhất)</Text>
              </>
            }
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh banner' }]}
            extra="Kích thước đề xuất: 1600x900px hoặc tỷ lệ 16:9"
          >
            <UploadFiles
              files={edittingBanner.image}
              isMultiple={false}
              imgsNumber={1}
              onChangeFile={(files: FileUpload[]) => {
                form.setFieldsValue({ bannerImage: files })
              }}
              isShowDirectory={false}
            />
          </Item>
        </Col>
        <Col xs={24} md={7}>
          <Item name="active" label="Kích hoạt">
            <Switch />
          </Item>
        </Col>
        <Col xs={24} md={7}>
          <Item name="textColor" label="Màu chữ tiêu đề & nội dung:">
            <ColorPicker showText />
          </Item>
        </Col>
      </Row>

      <Row gutter={[30, 30]}>
        <Col xs={24} md={12}>
          <Item
            name="bannerTypeId"
            label="Loại banner:"
            rules={[{ required: true, message: 'Vui lòng chọn loại banner' }]}
          >
            <Select
              options={map(bannerTypes, (bt: { name: any; key: any }) => ({
                label: bt.name,
                value: bt.key,
              }))}
              placeholder="Chọn loại banner"
            />
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item name="title" label="Tiêu đề">
            <Input placeholder="Nhập tiêu đề:" />
          </Item>
        </Col>
      </Row>
      <Row gutter={[30, 30]}>
        <Col xs={24} md={12}>
          <Item name="url" label="Đường dẫn:">
            <Input placeholder="Nhập đường dẫn:" />
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item name="content" label="Nội dung:">
            <Input placeholder="Nhập nội dung:" />
          </Item>
        </Col>
      </Row>

      <div className="align-center">
        <Space>
          <Button danger htmlType="submit" className="btn-border" icon={<PlusOutlined />}>
            {edittingBanner.isEditting ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button className="btn-form btn-border" onClick={onCancel}>
            Hủy bỏ
          </Button>
        </Space>
      </div>
    </Form>
  )
}

export default memo(BannerForm)
