import { VideoPopup, VideoPopupClip } from '@/app/lib/definitions'
import { isSafeCtaUrl } from '@/app/components/video-popup/videoPopupUrl'
import { uid } from '@/app/lib/utils'

export interface ClipDraft extends VideoPopupClip {
  key: string
  file?: File
}

export interface ListDraft {
  key: string
  id?: string
  title: string
  active: boolean
  clips: ClipDraft[]
}

export interface DraftListErrors {
  titleMissing: boolean
  videoMissing: boolean
  invalidCta: boolean
}

export function createEmptyClipDraft(): ClipDraft {
  return {
    key: uid(),
    videoUrl: '',
    videoFileName: '',
    label: '',
    ctaUrl: '',
  }
}

export function createEmptyListDraft(): ListDraft {
  return {
    key: uid(),
    title: '',
    active: true,
    clips: [],
  }
}

export function toDraftList(item: VideoPopup): ListDraft {
  return {
    key: item.id ?? uid(),
    id: item.id,
    title: item.title,
    active: item.active,
    clips: (item.clips ?? []).map((clip) => ({
      key: uid(),
      videoUrl: clip.videoUrl,
      videoFileName: clip.videoFileName,
      label: clip.label ?? '',
      ctaUrl: clip.ctaUrl ?? '',
    })),
  }
}

export function validateDraftList(list: ListDraft): DraftListErrors {
  return {
    titleMissing: !list.title.trim(),
    videoMissing: list.clips.length === 0 || list.clips.some((clip) => !clip.file && !clip.videoUrl),
    invalidCta: list.clips.some((clip) => {
      const ctaUrl = clip.ctaUrl?.trim() ?? ''
      return ctaUrl !== '' && !isSafeCtaUrl(ctaUrl)
    }),
  }
}

export function reorderClips(clips: ClipDraft[], fromIndex: number, direction: -1 | 1): ClipDraft[] {
  const target = fromIndex + direction
  if (target < 0 || target >= clips.length) return clips
  const next = [...clips]
  const [clip] = next.splice(fromIndex, 1)
  next.splice(target, 0, clip)
  return next
}

export function resolveFileDisplayName(clip: ClipDraft): string {
  if (clip.file?.name) return clip.file.name
  if (!clip.videoFileName) return ''
  const parts = clip.videoFileName.split('/')
  return parts[parts.length - 1] || clip.videoFileName
}

export function toClipPayload(clip: ClipDraft, videoUrl: string, videoFileName: string): VideoPopupClip {
  return {
    videoUrl,
    videoFileName,
    label: clip.label?.trim() || undefined,
    ctaUrl: clip.ctaUrl?.trim() || undefined,
  }
}

export function patchListAt(lists: ListDraft[], index: number, patch: Partial<ListDraft>): ListDraft[] {
  return lists.map((list, i) => (i === index ? { ...list, ...patch } : list))
}

export function patchClipAt(
  lists: ListDraft[],
  listIndex: number,
  clipIndex: number,
  patch: Partial<ClipDraft>,
): ListDraft[] {
  return lists.map((list, i) =>
    i === listIndex
      ? { ...list, clips: list.clips.map((clip, j) => (j === clipIndex ? { ...clip, ...patch } : clip)) }
      : list,
  )
}

export function appendList(lists: ListDraft[]): ListDraft[] {
  return [...lists, createEmptyListDraft()]
}

export function appendClip(lists: ListDraft[], listIndex: number): ListDraft[] {
  return lists.map((list, i) => (i === listIndex ? { ...list, clips: [...list.clips, createEmptyClipDraft()] } : list))
}

export function moveClipAt(lists: ListDraft[], listIndex: number, clipIndex: number, direction: -1 | 1): ListDraft[] {
  return lists.map((list, i) => (i === listIndex ? { ...list, clips: reorderClips(list.clips, clipIndex, direction) } : list))
}

export function removeClipAt(
  lists: ListDraft[],
  listIndex: number,
  clipIndex: number,
): { lists: ListDraft[]; removedKey: string } {
  const removedKey = lists[listIndex]?.clips[clipIndex]?.videoFileName ?? ''
  return {
    lists: lists.map((list, i) =>
      i === listIndex ? { ...list, clips: list.clips.filter((_, j) => j !== clipIndex) } : list,
    ),
    removedKey,
  }
}

export function removeListAt(lists: ListDraft[], index: number): { lists: ListDraft[]; removedKeys: string[] } {
  const removedKeys = (lists[index]?.clips ?? []).map((clip) => clip.videoFileName).filter(Boolean)
  return {
    lists: lists.filter((_, i) => i !== index),
    removedKeys,
  }
}