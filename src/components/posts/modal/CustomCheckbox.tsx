import React from 'react'
import { Checkbox, Link, User, Chip, cn, CheckboxProps } from '@nextui-org/react'

interface CustomCheckboxProps extends CheckboxProps {
  icon: React.ReactNode
  description?: string
  value: string
  label: string
  isSelected: boolean
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  icon,
  description,
  value,
  label,
  isSelected,
  ...props
}) => {
  return (
    <Checkbox
      aria-label={label}
      value={value}
      {...props}
      classNames={{
        base: cn(
          'inline-flex w-full max-w-2xl bg-content1 m-0',
          'hover:bg-content2 items-center justify-start',
          'flex-row-reverse cursor-pointer rounded-lg gap-2 p-4 border-2',
          {
            'border-primary': isSelected,
            'border-transparent': !isSelected
          }
        ),
        label: 'w-full'
      }}
      isSelected={isSelected}
    >
      <div className="w-full flex justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-3 rounded-full bg-gray-200 border border-gray-300">
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-md font-bold">{label}</span>
            {description && <span className="text-sm text-gray-500">{description}</span>}
          </div>
        </div>
      </div>
    </Checkbox>
  )
}

export default CustomCheckbox
