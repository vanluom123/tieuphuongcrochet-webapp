import { memo, useEffect } from 'react'
import {
  Button,
  Col,
  ColorPicker,
  Form,
  Input,
  notification,
  Row,
  Select,
  Switch,
  Typography,
} from 'antd'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { map } from 'lodash'
import UploadFiles from '@/app/components/upload-files'
import { Banner, DataType, FileUpload } from '@/app/lib/definitions'
import { uploadMultipleImagesToServer } from '@/app/lib/utils'
import styles from './SettingPage.module.scss'

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
  onClose?: () => void
}

const BannerForm = ({
  bannerTypes,
  bannersList,
  edittingBanner,
  setEdittingBanner,
  SetBannersList,
  setIsUpdatedBList,
  onClose,
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
      try {
        const uploadedFiles = await uploadMultipleImagesToServer(bannerImage, 'banners')
        fileContent = uploadedFiles[0].fileContent
        fileName = uploadedFiles[0].fileName
      } catch (error) {
        notification.error({
          message: 'Upload failed',
          description: error instanceof Error ? error.message : undefined,
        })
        return
      }
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
    onClose?.()
  }

  const onCancel = () => {
    if (edittingBanner.isEditting) {
      setEdittingBanner(initialEdittingBanner)
    }
    form.resetFields()
    onClose?.()
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
      <Row gutter={[20, 4]}>
        <Col xs={24} md={10}>
          <Item
            name="bannerImage"
            label={
              <>
                Hình ảnh banner <Text type="secondary">(tỷ lệ 16:9)</Text>
              </>
            }
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh banner' }]}
            extra="Kích thước đề xuất: 1600×900px"
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
        <Col xs={12} md={7}>
          <Item name="active" label="Hiển thị" valuePropName="checked">
            <Switch />
          </Item>
        </Col>
        <Col xs={12} md={7}>
          <Item name="textColor" label="Màu chữ tiêu đề & nội dung">
            <ColorPicker showText />
          </Item>
        </Col>
      </Row>

      <Row gutter={[20, 4]}>
        <Col xs={24} md={12}>
          <Item
            name="bannerTypeId"
            label="Loại banner"
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
            <Input placeholder="Nhập tiêu đề" />
          </Item>
        </Col>
      </Row>

      <Row gutter={[20, 4]}>
        <Col xs={24} md={12}>
          <Item name="url" label="Đường dẫn">
            <Input placeholder="Nhập đường dẫn" />
          </Item>
        </Col>
        <Col xs={24} md={12}>
          <Item name="content" label="Nội dung">
            <Input placeholder="Nhập nội dung" />
          </Item>
        </Col>
      </Row>

      <div className={styles.formActions}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button
          type="primary"
          htmlType="submit"
          icon={edittingBanner.isEditting ? <SaveOutlined /> : <PlusOutlined />}
        >
          {edittingBanner.isEditting ? 'Cập nhật banner' : 'Thêm vào danh sách'}
        </Button>
      </div>
    </Form>
  )
}

export default memo(BannerForm)
