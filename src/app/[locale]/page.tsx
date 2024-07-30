'use client'

import Post from '@/components/common/Post'
import BlankLayout from '@/components/layouts/BlankLayout'
import { Button } from '@nextui-org/button'
import { Image } from '@nextui-org/react'
import { landingProfile, landingPost } from '@/mock/landing'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { pathWithLocale } from '@/helpers/url/path-with-locale'
import { ROUTE } from '@/utils/constant/route'
import { POST_VARIANTS } from '@/utils/constant/variants'

export default function Home() {
  const t = useTranslations('landing')

  const pathname = usePathname()
  const router = useRouter()

  const handleRedirect = (path: string) => {
    const destinationPath = pathWithLocale(pathname, path)
    router.push(destinationPath)
  }

  const handleSelectedPost = () => {
    // handle landing post
  }

  const setPrivacyModal = () => {
    // set privacy modal
  }

  return (
    <BlankLayout>
      <div className="h-screen flex flex-col-reverse md:flex-col justify-end md:justify-start">
        <div className="text-center mt-[80px] flex flex-col text-3xl md:text-4xl font-bold gap-4 text-gray-700">
          <span>{t('text_1')}</span>
          <span>{t('text_2')}</span>
          <div className="flex-col mt-[50px] gap-5 md:hidden items-center flex bottom-0">
            <Button
              color="primary"
              className="text-xl w-[150px] h-[48px]"
              onPress={() => handleRedirect(ROUTE.auth.signin)}
            >
              {t('sign_in')}
            </Button>
            <Button
              className="text-primary text-xl w-[150px] h-[48px]"
              onPress={() => handleRedirect(ROUTE.auth.signup)}
            >
              {t('sign_up')}
            </Button>
          </div>
        </div>
        <div className="mt-[60px] md:mt-[150px] gap-[200px] md:justify-center flex flex-col md:flex-row items-center w-full">
          <div className="flex flex-col items-center w-full md:w-fit">
            <Image className="w-[240px]" alt="Logo" src="/logo.png" />
            <span className="font-bold text-gray-500 text-4xl mt-3">{t('slogan')}</span>
            <div className="flex-row mt-9 gap-[40px] hidden md:flex bottom-0">
              <Button
                color="primary"
                className="text-xl w-[150px] h-[48px]"
                onPress={() => handleRedirect(ROUTE.auth.signin)}
              >
                {t('sign_in')}
              </Button>
              <Button
                className="text-primary text-xl w-[150px] h-[48px]"
                onPress={() => handleRedirect(ROUTE.auth.signup)}
              >
                {t('sign_up')}
              </Button>
            </div>
          </div>
          <Post
            post={landingPost}
            variant={POST_VARIANTS.landing}
            toggleEditModal={() => handleSelectedPost}
            togglePrivacyModal={() => setPrivacyModal}
          />
        </div>
      </div>
    </BlankLayout>
  )
}
