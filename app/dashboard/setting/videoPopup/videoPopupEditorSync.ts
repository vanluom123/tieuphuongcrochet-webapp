import { VideoPopup, VideoPopupClip } from '@/app/lib/definitions'
import { deleteMultipleFilesToR2, uploadVideoToR2 } from '@/app/lib/service/r2Service'
import { saveVideoPopups } from '@/app/lib/service/videoPopupService'
import { ListDraft, ClipDraft, toClipPayload } from './videoPopupEditor.helpers'

async function uploadDraftClip(
  clip: ClipDraft,
  uploadFailedLabel: string,
): Promise<{ payload: VideoPopupClip; uploadedKey?: string; replacedKey?: string }> {
  if (!clip.file) {
    return { payload: toClipPayload(clip, clip.videoUrl, clip.videoFileName) }
  }
  let uploaded
  try {
    uploaded = await uploadVideoToR2(clip.file)
  } catch (error) {
    const detail = error instanceof Error ? error.message : ''
    throw new Error(detail ? `${uploadFailedLabel}: ${detail}` : uploadFailedLabel)
  }
  return {
    payload: toClipPayload(clip, uploaded.fileContent, uploaded.fileName),
    uploadedKey: uploaded.fileName,
    replacedKey: clip.videoFileName || undefined,
  }
}

// Uploads pending files, saves lists, then deletes orphaned R2 assets.
// If saving fails, freshly uploaded files are rolled back before the error is rethrown.
export async function syncVideoPopupDrafts(
  lists: ListDraft[],
  removedKeys: string[],
  uploadFailedLabel: string,
): Promise<VideoPopup[]> {
  const uploadedKeys: string[] = []
  const keysToDelete = new Set(removedKeys.filter(Boolean))
  let committed = false

  try {
    const payload: VideoPopup[] = []
    for (const list of lists) {
      const clips: VideoPopupClip[] = []
      for (const clip of list.clips) {
        const result = await uploadDraftClip(clip, uploadFailedLabel)
        if (result.uploadedKey) uploadedKeys.push(result.uploadedKey)
        if (result.replacedKey) keysToDelete.add(result.replacedKey)
        clips.push(result.payload)
      }
      payload.push({
        id: list.id,
        title: list.title.trim(),
        active: list.active,
        clips,
      })
    }

    const savedLists = await saveVideoPopups(payload)
    committed = true

    const retainedKeys = new Set(savedLists.flatMap((list) => (list.clips ?? []).map((clip) => clip.videoFileName)))
    const orphanedKeys = [...keysToDelete].filter((key) => !retainedKeys.has(key))
    if (orphanedKeys.length > 0) await deleteMultipleFilesToR2(orphanedKeys)

    return savedLists
  } catch (error) {
    if (!committed && uploadedKeys.length > 0) {
      await deleteMultipleFilesToR2(uploadedKeys)
    }
    throw error
  }
}