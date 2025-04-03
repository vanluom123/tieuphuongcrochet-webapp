import { IMAGE_FALLBACK } from "@/app/lib/constant";
import Image from "next/image";

export interface CustomNextImageProps {
    src?: string;
    alt?: string;
    className?: string;
    onClick?: () => void;
    aspectRatio?: string;
    objectFit?: 'cover' | 'scale-down' | 'contain' | 'none';
}

const CustomNextImage = ({ src, alt, className, onClick, aspectRatio = '100%', objectFit = 'cover' }: CustomNextImageProps) => {
    return (
        <div className="next-image-custom" style={{ position: 'relative', width: '100%', paddingTop: aspectRatio }}>
            <Image
                fill
                sizes="100%"
                style={{
                    objectFit: objectFit,
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