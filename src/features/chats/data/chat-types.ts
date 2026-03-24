import { type conversations } from './convo.json'

type BaseConvo = (typeof conversations)[number]['messages'][number]
type BaseChatUser = (typeof conversations)[number]

export type Convo = BaseConvo & {
  fileUrl?: string
  fileName?: string
  fileType?: string
}

export type ChatUser = Omit<BaseChatUser, 'messages'> & {
  messages: Convo[]
}
