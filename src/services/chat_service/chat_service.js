import _ from 'lodash'

const empty = (chatId) => {
  return {
    idIndex: {},
    messages: [],
    newMessageCount: 0,
    lastSeenTimestamp: 0,
    chatId: chatId,
    minId: undefined,
    maxId: undefined
  }
}

const clear = (storage) => {
  storage.idIndex = {}
  storage.messages.splice(0, storage.messages.length)
  storage.newMessageCount = 0
  storage.lastSeenTimestamp = 0
  storage.minId = undefined
  storage.maxId = undefined
}

const deleteMessage = (storage, messageId) => {
  if (!storage) { return }
  storage.messages = storage.messages.filter(m => m.id !== messageId)
  delete storage.idIndex[messageId]

  if (storage.maxId === messageId) {
    const lastMessage = _.maxBy(storage.messages, 'id')
    storage.maxId = lastMessage.id
  }

  if (storage.minId === messageId) {
    const firstMessage = _.minBy(storage.messages, 'id')
    storage.minId = firstMessage.id
  }
}

const add = (storage, { messages: newMessages, updateMaxId = true }) => {
  if (!storage) { return }
  for (let i = 0; i < newMessages.length; i++) {
    const message = newMessages[i]

    // sanity check
    if (message.chat_id !== storage.chatId) { return }

    if (!storage.minId || message.id < storage.minId) {
      storage.minId = message.id
    }

    if (!storage.maxId || message.id > storage.maxId) {
      if (updateMaxId) {
        storage.maxId = message.id
      }
    }

    if (!storage.idIndex[message.id]) {
      if (storage.lastSeenTimestamp < message.created_at) {
        storage.newMessageCount++
      }
      storage.messages.push(message)
      storage.idIndex[message.id] = message
    }
  }
}

const resetNewMessageCount = (storage) => {
  if (!storage) { return }
  storage.newMessageCount = 0
  storage.lastSeenTimestamp = new Date()
}

// Inserts date separators and marks the head and tail if it's the chain of messages made by the same user
const getView = (storage) => {
  if (!storage) { return [] }

  const result = []
  const messages = _.sortBy(storage.messages, ['id', 'desc'])
  const firstMessage = messages[0]
  let previousMessage = messages[messages.length - 1]
  let currentMessageChainId

  if (firstMessage) {
    const date = new Date(firstMessage.created_at)
    date.setHours(0, 0, 0, 0)
    result.push({
      type: 'date',
      date,
      id: date.getTime().toString()
    })
  }

  let afterDate = false

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    const nextMessage = messages[i + 1]

    const date = new Date(message.created_at)
    date.setHours(0, 0, 0, 0)

    // insert date separator and start a new message chain
    if (previousMessage && previousMessage.date < date) {
      result.push({
        type: 'date',
        date,
        id: date.getTime().toString()
      })

      previousMessage['isTail'] = true
      currentMessageChainId = undefined
      afterDate = true
    }

    const object = {
      type: 'message',
      data: message,
      date,
      id: message.id,
      messageChainId: currentMessageChainId
    }

    // end a message chian
    if ((nextMessage && nextMessage.account_id) !== message.account_id) {
      object['isTail'] = true
      currentMessageChainId = undefined
    }

    // start a new message chain
    if ((previousMessage && previousMessage.data && previousMessage.data.account_id) !== message.account_id || afterDate) {
      currentMessageChainId = _.uniqueId()
      object['isHead'] = true
      object['messageChainId'] = currentMessageChainId
    }

    result.push(object)
    previousMessage = object
    afterDate = false
  }

  return result
}

const ChatService = {
  add,
  empty,
  getView,
  deleteMessage,
  resetNewMessageCount,
  clear
}

export default ChatService
