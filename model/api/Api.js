const axios = require("axios");
const ChannelPost = require('../data/ChannelPost')
const ServerRequest = require("./ServerRequest");
require("dotenv/config")

class Api {

    static MODE = process.env.MODE
    static SERVER_URL = this.MODE === 'prod' ? process.env.BASE_PROD_URL : process.env.BASE_DEV_URL
    // static SERVER_URL = this.MODE === 'prod' ? "" : ""
    static FAQ_URL = process.env.FAQ_URL
    static FAQ_ENDPOINT_KEY = process.env.ENDPOINT_KEY

    static STATUS_OK = 200
    static STATUS_PARAMS_NOT_GIVEN = 400
    static STATUS_USER_NOT_FOUND = 404
    static STATUS_AUTH_NEEDED = 401
    static STATUS_SERVER_ERROR = 500


    // Authorize method
    static async retrieveUser({chat_id, telegram_token}) {
        const request = new ServerRequest(chat_id, telegram_token)
        const response = await axios.post(`/users/authorize`, request)
        console.log("Class: Api\nMethod: 'retrieveUser'\nResponse:", response)
        return response.data
    }

    static async retrieveStudentInfo({chat_id, telegram_token}) {
        const request = new ServerRequest(chat_id, telegram_token)
        const response = await axios.post(`/users/studentInfo`, request)
        console.log("Class: Api\nMethod: 'retrieveStudentInfo'\nResponse:", response)
        return response.data
    }

    static async submitPost({telegram_token, from_chat_id, message_id, date, is_poll}) {
        const channelPost = new ChannelPost({
            from_chat_id: from_chat_id,
            message_id: message_id,
            date: date,
            is_poll: is_poll
        })
        const request = new ServerRequest(from_chat_id, telegram_token, channelPost)
        const response = await axios.post(`/channels/posts`, request)
        return response.data
    }

    static async retrievePosts() {
        const response = await axios.get(`/channels/posts`)
        console.log(response.data)
        return response.data
    }

    static async retrieveTimetable({chat_id, telegram_token}) {
        const request = new ServerRequest(chat_id, telegram_token)
        const response = await axios.post(`/rasp`, request)
        console.log(response.data)
        return response.data
    }

    static async retrieveTelegramChatIds({chat_id, telegram_token}) {
        const request = new ServerRequest(chat_id, telegram_token)
        const response = await axios.post(`/users/telegram`, request)
        console.log(response.data)
        return response.data
    }

    static async retrieveFAQAnswer(text) {
        const response = await axios.post(`/questions/faq`,
            {'question': text}, {})
        return response.data
    }

    //TODO: Раскомментировать для тестинга
    // static async retrieveFAQAnswer(text){
    //     const response = await axios.post(`${this.FAQ_URL}/generateAnswer`,
    //         {'question': text}, {
    //             headers: {
    //                 'Authorization': `EndpointKey ${this.FAQ_ENDPOINT_KEY}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //     return response.data
    // }

    static getRegistrationURL({chat_id}) {
        return `https://oauth.tpu.ru/authorize?client_id=23&redirect_uri=${Api.SERVER_URL}/users/register&response_type=code&state=${chat_id}`
        // TODO: установил proxy localhost
        // return `https://oauth.tpu.ru/authorize?client_id=23&redirect_uri=http://85.143.78.60:3000/users/register&response_type=code&state=${chat_id}`
    }


}

module.exports = Api