import chatService from '../../../../../src/services/chat_service/chat_service.js'

const message1 = {
  id: '9wLkdcmQXD21Oy8lEX',
  created_at: (new Date('2020-06-22T18:45:53.000Z'))
}

const message2 = {
  id: '9wLkdp6ihaOVdNj8Wu',
  account_id: '9vmRb29zLQReckr5ay',
  created_at: (new Date('2020-06-22T18:45:56.000Z'))
}

const message3 = {
  id: '9wLke9zL4Dy4OZR2RM',
  account_id: '9vmRb29zLQReckr5ay',
  created_at: (new Date('2020-07-22T18:45:59.000Z'))
}

describe('chatService', () => {
  describe('.add', () => {
    it("Doesn't add duplicates", () => {
      const chat = chatService.empty()
      chatService.add(chat, { messages: [ message1 ] })
      chatService.add(chat, { messages: [ message1 ] })
      expect(chat.messages.length).to.eql(1)

      chatService.add(chat, { messages: [ message2 ] })
      expect(chat.messages.length).to.eql(2)
    })

    it('Updates minId and lastMessage and newMessageCount', () => {
      const chat = chatService.empty()

      chatService.add(chat, { messages: [ message1 ] })
      expect(chat.lastMessage.id).to.eql(message1.id)
      expect(chat.minId).to.eql(message1.id)
      expect(chat.newMessageCount).to.eql(1)

      chatService.add(chat, { messages: [ message2 ] })
      expect(chat.lastMessage.id).to.eql(message2.id)
      expect(chat.minId).to.eql(message1.id)
      expect(chat.newMessageCount).to.eql(2)

      chatService.resetNewMessageCount(chat)
      expect(chat.newMessageCount).to.eql(0)

      const createdAt = new Date()
      createdAt.setSeconds(createdAt.getSeconds() + 10)
      chatService.add(chat, { messages: [ { message3, created_at: createdAt } ] })
      expect(chat.newMessageCount).to.eql(1)
    })
  })

  describe('.delete', () => {
    it('Updates minId and lastMessage', () => {
      const chat = chatService.empty()

      chatService.add(chat, { messages: [ message1 ] })
      chatService.add(chat, { messages: [ message2 ] })
      chatService.add(chat, { messages: [ message3 ] })

      expect(chat.lastMessage.id).to.eql(message3.id)
      expect(chat.minId).to.eql(message1.id)

      chatService.deleteMessage(chat, message3.id)
      expect(chat.lastMessage.id).to.eql(message2.id)
      expect(chat.minId).to.eql(message1.id)

      chatService.deleteMessage(chat, message1.id)
      expect(chat.lastMessage.id).to.eql(message2.id)
      expect(chat.minId).to.eql(message2.id)
    })
  })

  describe('.getView', () => {
    it('Inserts date separators', () => {
      const chat = chatService.empty()

      chatService.add(chat, { messages: [ message1 ] })
      chatService.add(chat, { messages: [ message2 ] })
      chatService.add(chat, { messages: [ message3 ] })

      const view = chatService.getView(chat)
      expect(view.map(i => i.type)).to.eql(['date', 'message', 'message', 'date', 'message'])
    })
  })
})
