class ServerRequest {
    constructor(telegram_chat_id, telegram_token) {
        this.telegram_chat_id = telegram_chat_id
        this.telegram_token = telegram_token
    }
}

module.exports = ServerRequest