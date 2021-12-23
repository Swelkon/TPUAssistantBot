class User {

    constructor({
                    last_name,
                    first_name,
                    email,
                    chat_id,
                    is_student,
                    telegram_token,
                }) {

        this.last_name = last_name
        this.first_name = first_name
        this.email = email
        this.chat_id = chat_id
        this.is_student = is_student
        this.telegram_token = telegram_token

    }
}

module.exports = User