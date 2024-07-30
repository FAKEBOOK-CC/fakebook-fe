import { IPost } from '@/types/post'

export interface PostsProps {
  posts: IPost[],
  toggleEditPost: (postId: string) => void
  toggleSetPrivacyModal: () => void
}
