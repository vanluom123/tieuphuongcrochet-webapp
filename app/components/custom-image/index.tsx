import React from 'react';
import {
	DownloadOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
	SwapOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
} from '@ant-design/icons';
import { Image, ImageProps, Space } from 'antd';
import { IMAGE_FALLBACK } from '@/app/lib/constant';


interface DownloadImageProps extends ImageProps {
	src?: string;
	width?: number | string;
	alt?: string;
};

const DownloadImage = ({ src, width, alt, ...restProps }: DownloadImageProps) => {
	// or you can download flipped and rotated image
	// https://codesandbox.io/s/zi-ding-yi-gong-ju-lan-antd-5-7-0-forked-c9jvmp
	const onDownload = async () => {
		if (src) {
			try {
				const response = await fetch(src);
				const blob = await response.blob();
				const url = URL.createObjectURL(new Blob([blob]));
				const link = document.createElement('a');
				link.href = url;
				link.download = 'image.png';
				document.body.appendChild(link);
				link.click();
				URL.revokeObjectURL(url);
				link.remove();
			} catch (error) {
				console.error('Download failed:', error);
			}
		}
	};

	const renderToolbar = (
		_: unknown,
		{
			transform: { scale },
			actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn }
		}: {
			transform: { scale: number },
			actions: {
				onFlipY: () => void,
				onFlipX: () => void,
				onRotateLeft: () => void,
				onRotateRight: () => void,
				onZoomOut: () => void,
				onZoomIn: () => void
			}
		}
	) => (
		<Space size={12} className="toolbar-wrapper">
			{src && <DownloadOutlined onClick={onDownload} />}
			<SwapOutlined rotate={90} onClick={onFlipY} />
			<SwapOutlined onClick={onFlipX} />
			<RotateLeftOutlined onClick={onRotateLeft} />
			<RotateRightOutlined onClick={onRotateRight} />
			<ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
			<ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
		</Space>
	);

	return (
		<Image
			width={width}
			src={src}
			fallback={IMAGE_FALLBACK}
			preview={{ toolbarRender: renderToolbar }}
			alt={alt || 'image'}
			{...restProps}
		/>
	);
};

export default DownloadImage;