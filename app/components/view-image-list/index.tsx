'use client'
import { IMAGE_FALLBACK, DEFAULT_CHART_EDITOR } from "@/app/lib/constant";
import { FileUpload } from "@/app/lib/definitions";
import { checkPdfFile } from "@/app/lib/utils";
import { Watermark, Flex, Row, Col, Image, Empty, Collapse } from "antd"
import { map } from "lodash";
import { useTranslations } from "next-intl";
import DownloadImage from "../custom-image";
import PdfViewer from "../pdf-viewer";
import styles from "./ViewImagesList.module.scss";


interface ViewImagesProps {
	images?: FileUpload[];
	name: string;
	content?: string
	contentId?: string;
	isPattern?: boolean;
	contentTitle?: string;
}

const ViewImagesList = ({ images, name, content = '', isPattern, contentTitle }: ViewImagesProps) => {
	const t = useTranslations('FreePattern');

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
									checkPdfFile(images[0]?.fileName || '') ?
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
					<p className="align-center mt-0 text-lg">
						{contentTitle}
					</p>
					{(!content && !images) &&
						<Empty
							imageStyle={{ height: 80 }}
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
					}

					{/* crochet symbols default  */}
					{isPattern && (
						<Collapse
							className={styles.symbolsCollapse}
							expandIconPosition="end"
							items={[
								{
									key: 'crochet-symbols',
									label: t('crochet_symbols_guide'),
									children: (
										<div
											className={`editor-view disable-select text-box ${styles.symbolsBody}`}
											dangerouslySetInnerHTML={{ __html: DEFAULT_CHART_EDITOR || '' }}
										/>
									),
								},
							]}
						/>
					)}

					{images && images.length > 0 && renderImage()}
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