'use client'
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import '../../ui/components/pdfViewer.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfFile }: { pdfFile: any }) => {
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
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) =>
            <Page pageNumber={page}
              renderTextLayer={false}
              renderAnnotationLayer={false} />
          )}
      </Document>
    </div>
  );
}

export default PdfViewer;
