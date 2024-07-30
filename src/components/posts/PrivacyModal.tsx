import React, { useState, useRef, useEffect } from 'react'
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import { PostPrivacyEnum } from '@/utils/constant'
import { useTranslations } from 'next-intl'
import CustomCheckbox from './modal/CustomCheckbox'
import { GiWorld } from 'react-icons/gi'
import { GoLock, GoPeople } from 'react-icons/go'

interface PrivacyProps {
  isOpen: boolean
  onClose: () => void
  onSave: (privacy: PostPrivacyEnum) => void
}

const PrivacyModal: React.FC<PrivacyProps> = ({ isOpen, onClose, onSave }) => {
  const t = useTranslations('post.privacy')
  const [selectedOption, setSelectedOption] = useState<PostPrivacyEnum | undefined>(undefined)

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleOptionChange = (value: PostPrivacyEnum) => {
    setSelectedOption(value)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 transform -translate-x-40"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <div className="flex justify-center pb-4 text-2xl font-bold">{t('title')}</div>
          <div className="pt-4 space-y-4 w-full">
            <CustomCheckbox
              description={t('description.public')}
              value={PostPrivacyEnum.PUBLIC}
              label={t('public')}
              icon={<GiWorld size={20} />}
              isSelected={selectedOption === PostPrivacyEnum.PUBLIC}
              onChange={() => handleOptionChange(PostPrivacyEnum.PUBLIC)}
            />
            <CustomCheckbox
              description={t('description.friends')}
              value={PostPrivacyEnum.FRIENDS}
              label={t('friends')}
              icon={<GoPeople size={20} />}
              isSelected={selectedOption === PostPrivacyEnum.FRIENDS}
              onChange={() => handleOptionChange(PostPrivacyEnum.FRIENDS)}
            />
            <CustomCheckbox
              description={t('description.private')}
              value={PostPrivacyEnum.PRIVATE}
              label={t('private')}
              icon={<GoLock size={20} />}
              isSelected={selectedOption === PostPrivacyEnum.PRIVATE}
              onChange={() => handleOptionChange(PostPrivacyEnum.PRIVATE)}
            />
          </div>
          <div className="pt-4 flex justify-end space-x-4">
            <Button color="default" size="md" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button
              color="primary"
              size="md"
              onClick={() => {
                if (selectedOption) {
                  onSave(selectedOption)
                }
              }}
            >
              {t('save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyModal
