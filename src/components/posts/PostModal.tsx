'use client'

import { fullName } from '@/helpers/user/full-name'
import { Button, Input, Select, SelectItem, Textarea, User } from '@nextui-org/react'
import { useState, KeyboardEvent, ChangeEvent, useEffect } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { CiHashtag, CiImageOn, CiLocationOn } from 'react-icons/ci'
import { GoLock } from 'react-icons/go'
import Tags from './modal/Tags'
import { PostPrivacyEnum } from '@/utils/constant'
import useFileDialog from '@/hooks/useFileDialog'
import { MediaFile } from '@/types/props/common'
import Media from './modal/Media'
import { generateVideoThumbnail } from '@/helpers/video/preview'
import { useTranslations } from 'next-intl'
import { PostModalProps } from '@/types/props/post'

const PostModal: React.FC<PostModalProps> = ({ user, post, closePost }) => {
  const t = useTranslations('post.modal')

  const privacyOptions = Object.values(PostPrivacyEnum)

  const isEditPost = !!post

  const [tags, setTags] = useState<string[]>(post?.content.tag ?? [])
  const [currTag, setCurrTag] = useState<string>('')
  const [isLocationOn, setIsLocationOn] = useState<boolean>(!!post?.content.location)
  const [isFeelingOn, setIsFeelingOn] = useState<boolean>(!!post?.content.feeling)
  const [isTagOn, setIsTagOn] = useState<boolean>(false)
  const [isPrivacyOn, setIsPrivacyOn] = useState<boolean>(!!post?.privacy)
  const [location, setLocation] = useState<string>(post?.content.location ?? '')
  const [feeling, setFeeling] = useState<string>(post?.content.feeling ?? '')
  const [privacy, setPrivacy] = useState<PostPrivacyEnum>(post?.privacy ?? PostPrivacyEnum.PUBLIC)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [nextId, setNextId] = useState<number>(1)
  const [content, setContent] = useState<string>(post?.content.text ?? '')

  useEffect(() => {
    if (!post) return

    const imageFiles =
      post.content.imageUrls?.map((url, index) => ({
        id: index + 1,
        file: new File([], ''),
        url,
        preview: url
      })) ?? []

    const videoFiles =
      post.content.videoUrls?.map((url, index) => ({
        id: (post.content.imageUrls?.length ?? 0) + index + 1,
        file: new File([], ''),
        url,
        preview: url
      })) ?? []

    setMediaFiles([...imageFiles, ...videoFiles])
    setNextId((post.content.imageUrls?.length ?? 0) + (post.content.videoUrls?.length ?? 0) + 1)
  }, [post])

  const handleTags = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault()
      if (currTag.trim()) {
        setTags((prevTags) => [...prevTags, currTag.trim()])
        setCurrTag('')
      }
    }

    if (event.key === 'Backspace' && currTag === '' && tags.length > 0) {
      setTags((prevTags) => prevTags.slice(0, -1))
    }
  }

  const handleChangeContent = (event: ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
  }

  const handleChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrTag(event.target.value)
  }

  const handleChangeLocation = (event: ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value)
  }

  const handleChangeFeeling = (event: ChangeEvent<HTMLInputElement>) => {
    setFeeling(event.target.value)
  }

  const handleChangePrivacy = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as PostPrivacyEnum
    if (privacyOptions.includes(value)) {
      setPrivacy(value)
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = await Promise.all(
        Array.from(files).map(async (file) => {
          const preview = file.type.startsWith('video')
            ? await generateVideoThumbnail(file)
            : URL.createObjectURL(file)
          return {
            id: nextId,
            file: file,
            url: URL.createObjectURL(file),
            preview: preview
          }
        })
      )
      setNextId((prevId) => prevId + fileArray.length)
      setMediaFiles((prevFiles) => [...prevFiles, ...fileArray])
    }
  }

  const { openFileDialog, inputProps } = useFileDialog({
    multiple: true,
    accept: 'image/*,video/*',
    onChange: handleFileChange
  })

  const handleRemoveFile = (id: number) => {
    setMediaFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
  }

  const handleSave = () => {
    // handle edit post
  }

  const handlePost = () => {
    // handle create new post
  }

  return (
    <>
      <div className="fixed w-full h-full bg-gray-100 opacity-50" onClick={closePost}></div>
      <div className="fixed w-full top-[100px] max-w-[700px] h-fit min-h-[200px] bg-white rounded-lg shadow-lg opacity-100">
        <div className="my-6 mx-8">
          <User
            name={fullName(user.firstName, user.lastName)}
            avatarProps={{ src: user.avtUrl }}
            className="text-xl font-bold"
          />
          <div className="flex flex-col w-full bg-white rounded-lg min-h-[200px] mt-4">
            <Textarea
              className="text-lg w-full border-b-none"
              placeholder={t('placeholder')}
              value={content}
              onChange={handleChangeContent}
              minRows={6}
            />
            <div className="w-full flex gap-2 flex-wrap mt-2">
              {mediaFiles.map((mediaFile) => (
                <Media file={mediaFile} key={mediaFile.id} handleRemoveFile={handleRemoveFile} />
              ))}
            </div>
            <div className="flex gap-4 mt-4 mr-0 ml-auto">
              <Button color="default" size="sm" className="text-md" onClick={closePost}>
                {t('cancel')}
              </Button>
              <Button
                color="primary"
                size="sm"
                className="text-md"
                onClick={isEditPost ? handleSave : handlePost}
              >
                {isEditPost ? t('save') : t('post')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 bg-gray-100 mt-4 w-fit px-2 py-1 rounded-xl">
              <Button isIconOnly className="bg-gray-100" onClick={openFileDialog}>
                <CiImageOn className="w-5 h-5" />
              </Button>
              <input {...inputProps} />
              <Button
                isIconOnly
                className="bg-gray-100"
                onClick={() => setIsLocationOn((prev) => !prev)}
              >
                <CiLocationOn className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                className="bg-gray-100"
                onClick={() => setIsFeelingOn((prev) => !prev)}
              >
                <BsEmojiSmile className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                className="bg-gray-100"
                onClick={() => setIsTagOn((prev) => !prev)}
              >
                <CiHashtag className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                className="bg-gray-100"
                onClick={() => setIsPrivacyOn((prev) => !prev)}
              >
                <GoLock className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex mt-4 gap-4 items-center">
              {isLocationOn && (
                <Input
                  startContent={t('location')}
                  className="bg-gray-100 rounded-lg w-[200px]"
                  value={location}
                  onChange={handleChangeLocation}
                />
              )}
              {isFeelingOn && (
                <Input
                  startContent={t('feeling')}
                  className="bg-gray-100 rounded-lg w-[200px]"
                  value={feeling}
                  onChange={handleChangeFeeling}
                />
              )}
              {isPrivacyOn && (
                <Select
                  startContent={t('privacy')}
                  aria-label="Privacy"
                  className="bg-gray-100 rounded-lg w-[200px]"
                  value={privacy}
                  onChange={handleChangePrivacy}
                >
                  {privacyOptions.map((privacyOption) => (
                    <SelectItem key={privacyOption} value={privacyOption}>
                      {privacyOption}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </div>
            {isTagOn && (
              <Input
                className="bg-gray-100 mt-4 rounded-lg"
                startContent={<Tags tags={tags} />}
                value={currTag}
                onChange={handleChangeTag}
                onKeyDown={handleTags}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PostModal
