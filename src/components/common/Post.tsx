'use client'

import { fullName } from '@/helpers/user/full-name'
import { postTime } from '@/helpers/post/post-time'
import { User } from '@nextui-org/user'
import * as React from 'react'
import { formattedContent } from '@/helpers/post/formatted-content'
import { Button } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { GoComment, GoPaperAirplane, GoStar } from 'react-icons/go'
import { CiCircleMore } from 'react-icons/ci'
import { useState } from 'react'
import { FCarouselItemProps, PostProps } from '@/types/props/common'
import { POST_VARIANTS } from '@/utils/constant/variants'
import FCarousel from './FCarousel'
import Options from '../posts/Options'

const Post: React.FC<PostProps> = ({ post, variant, toggleEditModal, togglePrivacyModal }) => {
  const t = useTranslations('post')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const content = formattedContent(post)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const togglePost = () => {
    setIsHidden(!isHidden)
  }

  const toggleEditPost = () => {
    toggleEditModal()
  }

  const setPrivacy = () => {
    togglePrivacyModal()
  }

  const items: FCarouselItemProps[] = [
    {
      id: '1',
      mediaUrl:
        'https://res.cloudinary.com/dszkt92jr/image/upload/v1721463934/fgcnetakyb8nibeqr9do.png',
      type: 'image'
    },
    {
      id: '2',
      mediaUrl:
        'https://res.cloudinary.com/dszkt92jr/video/upload/v1721473062/Screencast_from_18-07-2024_15_42_45_nxip2u.mp4',
      type: 'video'
    }
  ]

  return (
    <>
      {isHidden ? (
        <div className="w-full max-w-[600px] bg-white border border-gray-200 rounded-lg">
          <div className="my-2 mx-3 flex flex-col">
            <span>{t('toggle.hide')}</span>
            <Button onClick={() => togglePost()}>{t('toggle.restore')}</Button>
          </div>
        </div>
      ) : (
        <div
          className={`w-full ${
            variant === POST_VARIANTS.feed
              ? 'max-w-[600px] rounded-lg bg-white'
              : variant === POST_VARIANTS.landing
              ? 'max-w-[448px] rounded-lg min-h-[220px] drop-shadow-md'
              : variant === POST_VARIANTS.sidebar
              ? 'h-[110px] cursor-pointer hover:bg-gray-50'
              : 'bg-white border-gray-50 rounded-lg min-h-[220px]'
          } border border-gray-200
        flex-col justify-between md:flex`}
        >
          <div
            className={`mx-3 md:mx-6 mt-4 flex flex-col items-start ${
              variant === POST_VARIANTS.sidebar ? 'gap-1' : 'gap-5'
            }`}
          >
            <div className="flex justify-between w-full items-start">
              <User
                name={fullName(post.user.firstName, post.user.lastName)}
                description={postTime(post)}
                avatarProps={{ src: post.user.avtUrl }}
                className="text-xl font-bold"
              />
              <div className="flex flex-col items-end">
                <div className="relative">
                  <Button
                    isIconOnly
                    className={`${variant === POST_VARIANTS.sidebar ? 'hidden' : 'text-2xl'}`}
                    variant="light"
                    onClick={() => toggleMenu()}
                  >
                    <CiCircleMore />
                  </Button>
                  {isMenuOpen && (
                    <Options
                      hidePost={togglePost}
                      editPost={toggleEditPost}
                      setPrivacy={setPrivacy}
                    />
                  )}
                </div>
                <div
                  className={`${
                    isMenuOpen ? '' : 'hidden'
                  } border border-gray-200 flex flex-col rounded-[8px] absolute top-[55px] right-[30px]`}
                >
                  <Button variant="light" className="w-[80px] h-[30px]" radius="none">
                    {t('hide')}
                  </Button>
                  <Button variant="light" className="w-[80px] h-[30px]" radius="none">
                    {t('report')}
                  </Button>
                </div>
              </div>
            </div>
            <span className={`${content.isBigContent ? 'text-2xl' : 'text-xl'}`}>
              {content.shortContent}
            </span>
            <Button
              variant="light"
              className={`text-gray-500 w-fit ${
                content.isNeedReadMore && variant !== POST_VARIANTS.sidebar ? '' : 'hidden'
              }`}
            >
              {t('read_more')}
            </Button>
            {variant === POST_VARIANTS.feed && <FCarousel items={items} />}
          </div>
          <div
            className={`h-[48px] w-full flex justify-between border-t border-gray-200 items-center ${
              variant === POST_VARIANTS.sidebar ? 'hidden' : ''
            }`}
          >
            <Button
              variant="light"
              startContent={<GoStar />}
              className={`text-base ${isLiked ? 'text-yellow-500' : ''} ${
                variant === POST_VARIANTS.feed ? 'md:ml-10' : ''
              }`}
              onClick={() => {
                setIsLiked(!isLiked)
              }}
            >
              {t('like')}
            </Button>
            <Button variant="light" startContent={<GoComment />} className="text-base">
              {t('comment')}
            </Button>
            <Button
              variant="light"
              startContent={<GoPaperAirplane />}
              className={`text-base ${variant === POST_VARIANTS.feed ? 'md:mr-10' : ''}`}
            >
              {t('share')}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default Post
