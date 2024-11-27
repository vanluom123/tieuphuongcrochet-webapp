import { IMAGE_FALLBACK } from "@/app/lib/constant";
import Image from "next/image";

interface CustomNextImageProps {
    src?: string;
    alt?: string;
    className?: string;
    onClick?: () => void;
}

const CustomNextImage = ({ src, alt, className, onClick }: CustomNextImageProps) => {
    return (
        <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
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