import { IMAGE_FALLBACK, DEFAULT_CHART_EDITOR } from "@/app/lib/constant";
import { FileUpload } from "@/app/lib/definitions";
import { checkPdfFile } from "@/app/lib/utils";
import { Watermark, Flex, Row, Col, Image, Empty } from "antd";
import { map } from "lodash";
import DownloadImage from "../custom-image";
import PdfViewer from "../pdf-viewer";

interface ViewImagesProps {
  images?: FileUpload[];
  name: string;
  content?: string;
  contentId?: string;
  isPattern?: boolean;
  contentTitle?: string;
}

const ViewImagesList = ({
  images,
  name,
  content = "",
  isPattern,
  contentTitle,
}: ViewImagesProps) => {
  const renderImage = () => (
    <Image.PreviewGroup fallback={IMAGE_FALLBACK}>
      <Flex className="image-detail" justify="center" wrap="wrap" gap={24}>
        <Row style={{ width: "100%" }} gutter={[20, 20]} className="justify-center">
          {images &&
            (images.length > 1 ? (
              map(images, (image, index) => (
                <Col xs={24} md={12} key={`${name}_${index}`}>
                  <DownloadImage src={image.fileContent} />
                </Col>
              ))
            ) : (
              <Col xs={24} md={22} key={`${name}`}>
                {checkPdfFile(images[0]?.fileName || "") ? (
                  <PdfViewer pdfFile={images[0]?.fileContent} />
                ) : (
                  <DownloadImage
                    key={`${name}_only`}
                    src={images[0]?.fileContent}
                  />
                )}
              </Col>
            ))}
        </Row>
      </Flex>
    </Image.PreviewGroup>
  );

  return (
    <Watermark content={["小方", "Tiểu Phương Crochet"]}>
      <section className={`${name}-detail-content pattern-sheet`}>
        {contentTitle && (
          <h2 className="pattern-sheet__heading">{contentTitle}</h2>
        )}

        {!content && (!images || images.length === 0) && (
          <Empty
            imageStyle={{ height: 80 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        {isPattern && (
          <div
            className="editor-view disable-select text-box"
            dangerouslySetInnerHTML={{ __html: DEFAULT_CHART_EDITOR || "" }}
          />
        )}

        {images && images.length > 0 && renderImage()}

        {content && (
          <div
            className="editor-view disable-select text-box"
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
        )}
      </section>
    </Watermark>
  );
};

export default ViewImagesList;
