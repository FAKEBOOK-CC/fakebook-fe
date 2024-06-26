'use client'

import * as React from 'react'
import { iconMap } from '@/utils/icons/icon-map'
import { ButtonOptionsProps } from '@/types/props/layouts'

const ButtonOption = ({ button, onClick, isActive }: ButtonOptionsProps) => {
  const IconComponent = iconMap[button.icon]

  return (
    <div className="relative flex-shrink-0 m-2">
      {button.count !== undefined && button.count > 0 && (
        <div className="absolute -top-2 -right-4 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-10 transform translate-y-0.5">
          <span className="text-xs">{button.count}</span>
        </div>
      )}
      <button
        className={`rounded-2xl p-3 -mx-3 border border-gray-100 cursor-pointer text-center relative z-0 transition-colors duration-200
          ${isActive ? 'bg-black text-white' : 'bg-zinc-200 hover:bg-zinc-300'}`}
        onClick={onClick}
        aria-label={button.name}
      >
        <IconComponent className="text-xl" aria-hidden="true" />
      </button>
    </div>
  )
}

export default ButtonOption
