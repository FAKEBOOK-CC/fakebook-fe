'use client'

import FImage from '@/components/common/FImage'
import PostModal from '@/components/posts/PostModal'
import PrivacyModal from '@/components/posts/PrivacyModal'
import Posts from '@/components/home/Posts'
import MainLayout from '@/components/layouts/MainLayout'
import { fakePosts } from '@/mock/posts'
import { useAppSelector } from '@/utils/store'
import { Button } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { IPost } from '@/types/post'
import { PostPrivacyEnum } from '@/utils/constant'

const Page = () => {
  const t = useTranslations('title')
  const tPost = useTranslations('post')

  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<IPost | undefined>(undefined)
  const [selectedPrivacy, setSelectedPrivacy] = useState<PostPrivacyEnum>(PostPrivacyEnum.PUBLIC)
  const user = useAppSelector((state) => state.user)

  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    setImageUrl(
      user.avtUrl ||
        'https://res.cloudinary.com/dszkt92jr/image/upload/v1719943637/vcbhui3dxeusphkgvycg.png'
    )
  }, [user.avtUrl])

  const getPostById = (postId: string): IPost => {
    const post = fakePosts.find((post) => post.id === postId)
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`)
    }
    return post
  }

  const togglePostModal = (post?: IPost) => {
    setSelectedPost(post)
    setIsPostModalOpen(true)
  }

  const togglePrivacyModal = () => {
    setIsPrivacyModalOpen(true)
  }

  const handleSelectedPost = (postId: string) => {
    try {
      const post = getPostById(postId)
      togglePostModal(post)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred')
    }
  }

  const handleSavePrivacy = (privacy: PostPrivacyEnum) => {
    setSelectedPrivacy(privacy)
  }

  return (
    <MainLayout title={t('home')}>
      <div className="w-full flex flex-col items-center">
        <div className="mx-auto w-full max-w-[632px] bg-gray-50 rounded-lg">
          <div className="flex mt-4 p-4 items-center">
            {imageUrl && <FImage src={imageUrl} alt="Avatar" className="w-12 h-12" />}
            <Button
              className="ml-4 grow bg-gray-200 text-gray-700"
              onClick={() => togglePostModal()}
            >
              {tPost('create_placeholder')}
            </Button>
          </div>
          <div className="pb-[20px]">
            <Posts
              posts={fakePosts}
              toggleEditPost={(postId) => handleSelectedPost(postId)}
              toggleSetPrivacyModal={togglePrivacyModal}
            />
          </div>
        </div>
        {isPostModalOpen && (
          <PostModal user={user} post={selectedPost} closePost={() => setIsPostModalOpen(false)} />
        )}
        <PrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          onSave={handleSavePrivacy}
        />
      </div>
    </MainLayout>
  )
}

export default Page
