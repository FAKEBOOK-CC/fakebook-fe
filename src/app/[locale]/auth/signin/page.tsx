'use client'

import * as React from 'react'
import AuthLayout from '@/components/layouts/AuthLayout'
import { useTranslations } from 'next-intl'
import InputWithError from '@/components/common/InputWithError'
import { Button, Input } from '@nextui-org/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ISignInFormValues } from '@/helpers/form-value/signin-value'
import { EyeSlashFilledIcon } from '@/utils/icons/EyeSlashFilledIcon'
import { EyeFilledIcon } from '@/utils/icons/EyeFilledIcon'
import { usePathname, useRouter } from 'next/navigation'
import { pathWithLocale } from '@/helpers/url/path-with-locale'
import { ROUTE } from '@/utils/constant/route'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/utils/store'
import { setAuth } from '@/utils/store/auth'
import { fToast } from '@/helpers/toast'
import { RESPONSE_CODES } from '@/utils/constant/codes'
import { useState } from 'react'

const Page: React.FC = () => {
  const t = useTranslations('auth')

  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleRedirect = (path: string) => {
    const destinationPath = pathWithLocale(pathname, path)
    router.push(destinationPath)
  }

  const signInSchema = z.object({
    email: z.string().email({ message: t('error_messages.email') }),
    password: z.string()
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISignInFormValues>({
    resolver: zodResolver(signInSchema)
  })

  const onSubmit = async (data: ISignInFormValues) => {
    setIsLoading(true)
    try {
      const signInRes = await signIn(data.email, data.password)
      if (signInRes) {
        const code = signInRes.code
        switch (code) {
          case RESPONSE_CODES.SUCCESS:
            dispatch(setAuth(signInRes.result))
            fToast(t('toast.signin.success'), 'success')
            handleRedirect(ROUTE.pages.home)
            break

          case RESPONSE_CODES.USER_NOT_EXISTED:
            fToast(t('toast.signin.not_exist'), 'danger')
            break

          case RESPONSE_CODES.WRONG_PASSWORD:
            fToast(t('toast.signin.wrong_password'), 'danger')
            break

          default:
            fToast(t('toast.unknown'), 'danger')
        }
      } else {
        fToast(t('toast.unknown'), 'danger')
      }
    } catch (error) {
      fToast(t('toast.unknown'), 'danger')
      console.error('Error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mt-[50px] flex flex-col w-[360px] md:w-[420px] min-h-[420px] rounded-[20px] border border-gray-200 justify-between shadow-md">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold mt-[20px]">{t('sign_in')}</span>
          <form className="flex flex-col items-center w-fit mt-[20px] gap-[14px]">
            <InputWithError>
              <Input
                type="email"
                {...register('email')}
                label={t('email')}
                className="w-[314px] md:w-[340px] h-[56px]"
                size="lg"
              />
              <p className="text-red-500 text-sm">{errors?.email?.message}</p>
            </InputWithError>
            <InputWithError>
              <Input
                type={isVisible ? 'text' : 'password'}
                {...register('password')}
                label={t('password')}
                className="w-[314px] md:w-[340px] h-[56px]"
                size="lg"
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeFilledIcon className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeSlashFilledIcon className="text-xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </InputWithError>
            <div className="flex justify-end w-full mr-2 -mt-2">
              <Button
                className="text-[16px] text-gray-500 font-bold bg-white border-none cursor-pointer -p-2"
                onPress={() => handleRedirect(ROUTE.auth.forgot_password)}
              >
                {t('forgot_password_button')}
              </Button>
            </div>
            <Button
              className="my-4 h-[38px]"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              {t('sign_in')}
            </Button>
          </form>
        </div>
        <div className="flex mx-auto flex items-center mb-[30px] mt-[40px] gap-[10px]">
          <span className="text-gray-500 font-bold">{t('not_have_account')}</span>
          <Button
            className="w-[90px] h-[38px]"
            color="primary"
            variant="bordered"
            onPress={() => handleRedirect(ROUTE.auth.signup)}
          >
            {t('sign_up')}
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Page
