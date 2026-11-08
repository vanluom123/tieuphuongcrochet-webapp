'use client'

import dynamic from 'next/dynamic'
import { useVideoPopup } from './useVideoPopup'

const VideoPopupModal = dynamic(() => import('./VideoPopupModal'), { ssr: false })

export default function VideoPopupProvider({ children }: { children: React.ReactNode }) {
  const { popup, open, complete } = useVideoPopup()

  return (
    <>
      {children}
      {popup && open ? <VideoPopupModal open={open} popup={popup} onCompleted={complete} /> : null}
    </>
  )
}
