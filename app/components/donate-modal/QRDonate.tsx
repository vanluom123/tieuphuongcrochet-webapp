import {Image} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";

const QRDonate = () => {
    return(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Image
                src="/donate-qr-702.png"
                alt="QR Payment"
                width='180px'
                height='auto'
                style={{ margin: '0 auto 16px' }}
                preview={false}
            />
            <Paragraph style={{ textAlign: 'center', fontWeight: 'bold', margin: 0 }}>
                <span style={{ fontSize: 18, color: '#5e35b1', display: 'block', marginBottom: 8 }}>DO THI THAM PHUONG</span>
                <span style={{ fontSize: 18, display: 'block' }}>0331 2912 702</span>
                <span style={{ fontSize: 14, color: '#666', display: 'block', marginTop: 8 }}>TPBank | VietQR</span>
            </Paragraph>
        </div>
    )
}
export default QRDonate;