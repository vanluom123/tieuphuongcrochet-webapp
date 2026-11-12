import { VideoPopup, VideoPopupClip } from '@/app/lib/definitions'
import { uploadVideoToR2 } from '@/app/lib/service/r2Service'
import { saveVideoPopups } from '@/app/lib/service/videoPopupService'
import { ListDraft, ClipDraft, toClipPayload } from './videoPopupEditor.helpers'

async function uploadDraftClip(
  clip: ClipDraft,
  uploadFailedLabel: string,
): Promise<VideoPopupClip> {
  if (!clip.file) {
    return toClipPayload(clip, clip.videoUrl, clip.videoFileName)
  }
  let uploaded
  try {
    uploaded = await uploadVideoToR2(clip.file)
  } catch (error) {
    const detail = error instanceof Error ? error.message : ''
    throw new Error(detail ? `${uploadFailedLabel}: ${detail}` : uploadFailedLabel)
  }
  return toClipPayload(clip, uploaded.fileContent, uploaded.fileName)
}

// The backend owns cleanup; a failed save response may follow a committed transaction.
export async function syncVideoPopupDrafts(
  lists: ListDraft[],
  uploadFailedLabel: string,
): Promise<VideoPopup[]> {
  const payload: VideoPopup[] = []
  for (const list of lists) {
    const clips: VideoPopupClip[] = []
    for (const clip of list.clips) {
      clips.push(await uploadDraftClip(clip, uploadFailedLabel))
    }
    payload.push({
      id: list.id,
      title: list.title.trim(),
      active: list.active,
      clips,
    })
  }
  return saveVideoPopups(payload)
}