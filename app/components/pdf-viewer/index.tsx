'use client'
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import '../../ui/components/pdfViewer.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfFile }: { pdfFile: File | string }) => { // Specify a more precise type
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className='view-pdf-wrap'>
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {[...Array(numPages)].map((_, i) => ( // Use spread operator
          <Page
            key={i} // Add key prop
            pageNumber={i + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}

export default PdfViewer;
