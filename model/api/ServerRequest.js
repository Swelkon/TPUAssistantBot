class ServerRequest {
    constructor(telegram_chat_id, telegram_token, data = null) {
        this.telegram_chat_id = telegram_chat_id
        this.telegram_token = telegram_token
        this.data = data
    }
}

module.exports = ServerRequest