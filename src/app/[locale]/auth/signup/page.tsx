'use client'

import * as React from 'react'
import AuthLayout from '@/components/layouts/AuthLayout'
import { Button, Input } from '@nextui-org/react'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ISignUpFormValues } from '@/helpers/form-value/signup-value'
import InputWithError from '@/components/common/InputWithError'
import { ROUTE } from '@/utils/constant/route'
import { usePathname, useRouter } from 'next/navigation'
import { pathWithLocale } from '@/helpers/url/path-with-locale'
import { sendActivationMail } from '@/app/api/route/send-activation'
import { getLocale } from '@/helpers/url/get-locale'
import { generateActivationLink } from '@/helpers/activation/activation-link'
import { getBaseUrl } from '@/helpers/url/base-url'

const Page: React.FC = () => {
  const t = useTranslations('auth')

  const router = useRouter()
  const pathname = usePathname()

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
    try {
      const locale = getLocale(pathname)
      const baseUrl = getBaseUrl()
      const activationLink = generateActivationLink({ email: data.email, locale, baseUrl })
      console.log(activationLink)
      await sendActivationMail({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        activationLink
      })
      console.log('Submitted data: ', data)
      handleRedirect(ROUTE.auth.activate)
    } catch (error) {
      console.error('Error: ', error)
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
                placeholder={t('email')}
                className="w-[314px] md:w-[340px] h-[48px]"
                size="lg"
              />
              <p className="text-red-500 text-sm">{errors?.email?.message}</p>
            </InputWithError>
            <InputWithError>
              <div className="flex justify-between w-full">
                <Input
                  type="text"
                  {...register('firstName')}
                  placeholder={t('first_name')}
                  className="w-[150px] md:w-[162px] h-[48px]"
                  size="lg"
                />
                <Input
                  type="text"
                  {...register('lastName')}
                  placeholder={t('last_name')}
                  className="w-[150px] md:w-[162px] h-[48px]"
                  size="lg"
                />
              </div>
              <p className="text-red-500 text-sm">{errors?.firstName?.message}</p>
              <p className="text-red-500 text-sm">{errors?.lastName?.message}</p>
            </InputWithError>
            <InputWithError>
              <Input
                type="password"
                placeholder={t('password')}
                {...register('password')}
                className="w-[314px] md:w-[340px] h-[48px]"
                size="lg"
              />
              <p className="text-red-500 text-sm">{errors?.password?.message}</p>
            </InputWithError>
            <InputWithError>
              <Input
                type="password"
                {...register('confirmPassword')}
                placeholder={t('confirm_password')}
                className="w-[314px] md:w-[340px] h-[48px]"
                size="lg"
              />
              <p className="text-red-500 text-sm">{errors?.confirmPassword?.message}</p>
            </InputWithError>
            <Button className="w-[90px] h-[38px]" color="primary" onClick={handleSubmit(onSubmit)}>
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
