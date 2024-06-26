'use client'

import * as React from 'react'
import { Image } from '@nextui-org/react'
import { AuthLayoutProps } from '@/types/props/layouts'

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="w-full flex flex-col items-center mt-[100px]">
      <Image alt="logo" src="/logo.png" className="w-[235px]" />
      <div>{children}</div>
    </div>
  )
}

export default AuthLayout
