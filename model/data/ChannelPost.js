class ChannelPost {

    constructor({from_chat_id, message_id, date, is_poll}) {
        this.from_chat_id = from_chat_id
        this.message_id = message_id
        this.date = date
        this.is_poll = is_poll
    }

}

module.exports = ChannelPost