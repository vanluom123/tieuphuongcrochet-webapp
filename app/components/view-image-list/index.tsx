import { IMAGE_FALLBACK, DEFAULT_CHART_EDITOR } from "@/app/lib/constant";
import { FileUpload } from "@/app/lib/definitions";
import { checkPdfFile } from "@/app/lib/utils";
import { Watermark, Flex, Row, Col, Image, Empty } from "antd"
import { map } from "lodash";
import DownloadImage from "../custom-image";
import PdfViewer from "../pdf-viewer";


interface ViewImagesProps {
	images?: FileUpload[];
	name: string;
	content?: string
	contentId?: string;
	isPattern?: boolean;
	contentTitle?: string;
}

const ViewImagesList = ({ images, name, content = '', isPattern, contentTitle }: ViewImagesProps) => {

	const renderImage = () => (
		<Image.PreviewGroup
			fallback={IMAGE_FALLBACK}
		>
			<Flex className="image-detail" justify='center' wrap="wrap" gap={24}>
				<Row style={{ width: '100%' }} gutter={[30, 30]} className='justify-center'>
					{
						images && (images?.length > 1 ?
							map(images, (image, index) => (
								<Col md={12} key={`${name}_${index}`}>
									<DownloadImage
										src={image.fileContent} />
								</Col>
							)) :
							<Col md={22} key={`${name}`}>
								{
									checkPdfFile(images[0]?.fileName) ?
										<PdfViewer pdfFile={images[0]?.fileContent} /> :
										<DownloadImage
											key={`${name}_only`}
											src={images[0]?.fileContent} />
								}
							</Col>)
					}
				</Row>
			</Flex>
		</Image.PreviewGroup>
	);

	return (
		<div>
			< Watermark
				content={['小方', 'Tiểu Phương Crochet']}
			>
				<div
					className={`${name}-detail-content`}
				>
					<h1 className="align-center mt-0">
						{contentTitle}
					</h1>
					{(!content && !images) &&
						<Empty
							imageStyle={{ height: 80 }}
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
					}
					{images && images.length > 0 && renderImage()}

					{/* crochet symbols default  */}
					{isPattern && <div className='editor-view disable-select text-box' dangerouslySetInnerHTML={{ __html: DEFAULT_CHART_EDITOR || '' }} />}

					{content &&
						<>
							<div className='editor-view disable-select text-box' dangerouslySetInnerHTML={{ __html: content || '' }} />
						</>
					}
				</div>
			</Watermark >
		</div>
	)
}
export default ViewImagesList;