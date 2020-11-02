import _ from 'lodash'

const empty = (chatId) => {
  return {
    idIndex: {},
    idempotencyKeyIndex: {},
    messages: [],
    newMessageCount: 0,
    lastSeenMessageId: '0',
    chatId: chatId,
    minId: undefined,
    maxId: undefined
  }
}

const clear = (storage) => {
  const failedMessageIds = []

  for (const message of storage.messages) {
    if (message.error) {
      failedMessageIds.push(message.id)
    } else {
      delete storage.idIndex[message.id]
      delete storage.idempotencyKeyIndex[message.id]
    }
  }

  storage.messages = storage.messages.filter(m => failedMessageIds.includes(m.id))
  storage.newMessageCount = 0
  storage.lastSeenMessageId = '0'
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

const handleMessageError = (storage, fakeId, isRetry) => {
  if (!storage) { return }
  const fakeMessage = storage.idIndex[fakeId]
  if (fakeMessage) {
    fakeMessage.error = true
    fakeMessage.pending = false
    if (!isRetry) {
      // Ensure the failed message doesn't stay at the bottom of the list.
      const lastPersistedMessage = _.orderBy(storage.messages, ['pending', 'id'], ['asc', 'desc'])[0]
      if (lastPersistedMessage) {
        const oldId = fakeMessage.id
        fakeMessage.id = `${lastPersistedMessage.id}-${new Date().getTime()}`
        storage.idIndex[fakeMessage.id] = fakeMessage
        delete storage.idIndex[oldId]
      }
    }
  }
}

const add = (storage, { messages: newMessages, updateMaxId = true }) => {
  if (!storage) { return }
  for (let i = 0; i < newMessages.length; i++) {
    const message = newMessages[i]

    // sanity check
    if (message.chat_id !== storage.chatId) { return }

    if (message.fakeId) {
      const fakeMessage = storage.idIndex[message.fakeId]
      if (fakeMessage) {
        // In case the same id exists (chat update before POST response)
        // make sure to remove the older duplicate message.
        if (storage.idIndex[message.id]) {
          delete storage.idIndex[message.id]
          storage.messages = storage.messages.filter(msg => msg.id !== message.id)
        }
        Object.assign(fakeMessage, message, { error: false })
        delete fakeMessage['fakeId']
        storage.idIndex[fakeMessage.id] = fakeMessage
        delete storage.idIndex[message.fakeId]

        return
      }
    }

    if (!storage.minId || (!message.pending && message.id < storage.minId)) {
      storage.minId = message.id
    }

    if (!storage.maxId || message.id > storage.maxId) {
      if (updateMaxId) {
        storage.maxId = message.id
      }
    }

    if (!storage.idIndex[message.id] && !isConfirmation(storage, message)) {
      if (storage.lastSeenMessageId < message.id) {
        storage.newMessageCount++
      }
      storage.idIndex[message.id] = message
      storage.messages.push(storage.idIndex[message.id])
      storage.idempotencyKeyIndex[message.idempotency_key] = true
    }
  }
}

const isConfirmation = (storage, message) => {
  if (!message.idempotency_key) return
  return storage.idempotencyKeyIndex[message.idempotency_key]
}

const resetNewMessageCount = (storage) => {
  if (!storage) { return }
  storage.newMessageCount = 0
  storage.lastSeenMessageId = storage.maxId
}

// Inserts date separators and marks the head and tail if it's the chain of messages made by the same user
const getView = (storage) => {
  if (!storage) { return [] }

  const result = []
  const messages = _.orderBy(storage.messages, ['pending', 'id'], ['asc', 'asc'])
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
  clear,
  handleMessageError
}

export default ChatService
