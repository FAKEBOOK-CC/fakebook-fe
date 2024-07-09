'use client'

import * as React from 'react'
import AuthLayout from '@/components/layouts/AuthLayout'
import { Button, Input } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ISignUpFormValues } from '@/helpers/form-value/signup-value'
import { EyeSlashFilledIcon } from '@/utils/icons/EyeSlashFilledIcon'
import { EyeFilledIcon } from '@/utils/icons/EyeFilledIcon'
import InputWithError from '@/components/common/InputWithError'
import { ROUTE } from '@/utils/constant/route'
import { usePathname, useRouter } from 'next/navigation'
import { pathWithLocale } from '@/helpers/url/path-with-locale'
import { sendActivationMail } from '@/app/api/route/send-activation'
import { getLocale } from '@/helpers/url/get-locale'
import { generateActivationLink } from '@/helpers/activation/activation-link'
import { getBaseUrl } from '@/helpers/url/base-url'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { RESPONSE_CODES } from '@/utils/constant/codes'
import { fToast } from '@/helpers/toast'

const Page: React.FC = () => {
  const t = useTranslations('auth')

  const router = useRouter()
  const pathname = usePathname()

  const { getEncodedUrl, signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)

  const handleRedirect = (path: string) => {
    const destinationPath = pathWithLocale(pathname, path)
    router.push(destinationPath)
  }

  const signUpSchema = z
    .object({
      email: z.string().email({ message: t('error_messages.email') }),
      firstName: z
        .string()
        .min(1, { message: t('error_messages.first_name') })
        .max(20, {
          message: t('error_messages.first_name')
        }),
      lastName: z
        .string()
        .min(1, { message: t('error_messages.last_name') })
        .max(20, { message: t('error_messages.last_name') }),
      password: z
        .string()
        .min(8, { message: t('error_messages.password.length') })
        .regex(/[a-z]/, {
          message: t('error_messages.password.lowercase')
        })
        .regex(/[A-Z]/, {
          message: t('error_messages.password.uppercase')
        })
        .regex(/[0-9]/, {
          message: t('error_messages.password.number')
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: t('error_messages.password.special')
        }),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('error_messages.password.confirm'),
      path: ['confirmPassword']
    })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISignUpFormValues>({
    resolver: zodResolver(signUpSchema)
  })

  const onSubmit = async (data: ISignUpFormValues) => {
    setIsLoading(true)
    try {
      const signUpRes = await signUp(data.email, data.firstName, data.lastName, data.password)
      if (signUpRes) {
        const code = signUpRes.code
        switch (code) {
          case RESPONSE_CODES.SUCCESS:
            fToast(t('toast.signup.success'), 'success')
            const { email, firstName, lastName } = signUpRes.result
            const locale = getLocale(pathname)
            const baseUrl = getBaseUrl()
            const activationLink = generateActivationLink({
              email,
              locale,
              baseUrl
            })
            const plainUrl = await getEncodedUrl(email, activationLink)
            if (plainUrl) {
              await sendActivationMail({
                email: email,
                firstName: firstName,
                lastName: lastName,
                activationLink: plainUrl.result.urlEncoded
              })
            }
            // handleRedirect(ROUTE.auth.activate)
            break

          case RESPONSE_CODES.USER_EXISTED:
            fToast(t('toast.signup.existed'), 'danger')
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
      <div className="mt-[50px] flex flex-col w-[360px] md:w-[420px] min-h-[485px] rounded-[20px] border border-gray-200 justify-between shadow-md">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold mt-[20px]">{t('sign_up')}</span>
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
              <div className="flex justify-between w-full">
                <Input
                  type="text"
                  {...register('firstName')}
                  label={t('first_name')}
                  className="w-[150px] md:w-[162px] h-[56px]"
                  size="lg"
                />
                <Input
                  type="text"
                  {...register('lastName')}
                  label={t('last_name')}
                  className="w-[150px] md:w-[162px] h-[56px]"
                  size="lg"
                />
              </div>
              <p className="text-red-500 text-sm">{errors?.firstName?.message}</p>
              <p className="text-red-500 text-sm">{errors?.lastName?.message}</p>
            </InputWithError>
            <InputWithError>
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                {...register('password')}
                label={t('password')}
                className="w-[314px] md:w-[340px] h-[56px]"
                size="lg"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <EyeFilledIcon className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeSlashFilledIcon className="text-xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              <p className="text-red-500 text-sm">{errors?.password?.message}</p>
            </InputWithError>
            <InputWithError>
              <Input
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                {...register('confirmPassword')}
                label={t('confirm_password')}
                className="w-[314px] md:w-[340px] h-[56px]"
                size="lg"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeFilledIcon className="text-xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeSlashFilledIcon className="text-xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              <p className="text-red-500 text-sm">{errors?.confirmPassword?.message}</p>
            </InputWithError>
            <Button
              className="my-4 h-[38px]"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              {t('sign_up')}
            </Button>
          </form>
        </div>
        <div className="flex mx-auto flex items-center mb-[30px] mt-[40px] gap-[10px]">
          <span className="text-gray-500 font-bold">{t('have_account')}</span>
          <Button
            className="w-[90px] h-[38px]"
            color="primary"
            variant="bordered"
            onPress={() => handleRedirect(ROUTE.auth.signin)}
          >
            {t('sign_in')}
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Page
