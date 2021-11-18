class User {

    constructor({
                    last_name,
                    first_name,
                    email,
                    lichnost_id,
                    user_id,
                    chat_id,
                    gruppa,
                    department,
                    direction_of_training,
                    form_of_education,
                    type_of_financing,
                    access_token
                }) {
        this.last_name = last_name
        this.first_name = first_name
        this.email = email
        this.lichnost_id = lichnost_id
        this.user_id = user_id
        this.chat_id = chat_id
        this.access_token = access_token
        this.gruppa = gruppa
        this.department = department
        this.direction_of_training = direction_of_training
        this.form_of_education = form_of_education
        this.type_of_financing = type_of_financing
    }
}

module.exports = User