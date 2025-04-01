import { IMAGE_FALLBACK } from "@/app/lib/constant";
import Image from "next/image";

export interface CustomNextImageProps {
    src?: string;
    alt?: string;
    className?: string;
    onClick?: () => void;
    aspectRatio?: string;
}

const CustomNextImage = ({ src, alt, className, onClick, aspectRatio = '100%' }: CustomNextImageProps) => {
    return (
        <div style={{ position: 'relative', width: '100%', paddingTop: aspectRatio }}>
            <Image
                fill
                sizes="100%"
                style={{
                    objectFit: 'cover',
                }}
                loading='lazy'
                src={src || IMAGE_FALLBACK}
                onError={(e: any) => {
                    e.target.src = IMAGE_FALLBACK;  
                }}
                alt={alt || 'image fallback'}
                className={className}
                onClick={onClick}
            />
        </div>
    )
}

export default CustomNextImage;