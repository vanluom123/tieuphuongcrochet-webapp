'use client'

import { ReactNode } from 'react'
import VideoPopupProvider from '@/app/components/video-popup/VideoPopupProvider'

export default function MainLayout({ children }: { children: ReactNode }) {
  return <VideoPopupProvider>{children}</VideoPopupProvider>
}
