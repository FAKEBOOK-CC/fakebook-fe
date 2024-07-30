import { IPost } from '@/types/post'
import { POST_VARIANTS } from '@/utils/constant/variants'

export interface PostProps {
  post: IPost
  variant?: POST_VARIANTS
  toggleEditModal: () => void
  togglePrivacyModal: () => void
}

export interface OverlayProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export interface FImageProps {
  src: string
  alt: string
  className?: string
}

export interface ShowPasswordProps {
  isVisible: boolean
  toggleShowPassword: () => void
}

export interface FCarouselItemProps {
  id: string
  mediaUrl: string
  type: string
}

export interface FVideoProps {
  src: string
  className?: string
}

export interface MediaFile {
  id: number
  file: File
  url: string
  preview?: string
}
