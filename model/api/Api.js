const axios = require("axios");

class Api {

    SERVER_URL = "http://85.143.78.60:3000"

    async authorizeUser({chat_id, access_token}) {
        try{
            const response = await axios.post(`${this.SERVER_URL}/users/authorize/${chat_id}`)
            console.log('response:', response)
            console.log('Status:',response.data.status)

            return response.data
        } catch (e) {

        }
    }

}

module.exports = Api