class User {

    constructor({last_name, first_name, email, lichnost_id, user_id, chat_id, access_token}) {
        this.last_name = last_name
        this.first_name = first_name
        this.email = email
        this.lichnost_id = lichnost_id
        this.user_id = user_id
        this.chat_id = chat_id
        this.access_token = access_token
    }
}

module.exports = User