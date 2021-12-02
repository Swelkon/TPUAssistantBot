const User = require('./data/User')
const Api = require('./api/Api')
const constants = require("./constants");

class DataBus {

    static get numOfNews() {
        return DataBus.polls.length + DataBus.posts.length
    }

    static polls = []
    static posts = []
    static allowedChannels = [-1001614453874]

    static async retrieveUser({ctx, chat_id, telegram_token}) {
        try {
            const serverResponse = await Api.retrieveUser({
                chat_id: chat_id,
                telegram_token: telegram_token
            })

            // If status is OK
            if (serverResponse.status === Api.STATUS_OK) {
                console.log("DataBus | retrieveUser() | user retrieved successfully ")
                const user = serverResponse.data
                ctx.session.user = new User({
                    last_name: user.last_name,
                    first_name: user.first_name,
                    email: user.email,
                    lichnost_id: user.lichnost_id,
                    user_id: user.user_id,
                    chat_id: chat_id,
                    gruppa: user.gruppa,
                    department: user.department,
                    direction_of_training: user.direction_of_training,
                    form_of_education: user.form_of_education,
                    type_of_financing: user.type_of_financing,
                    telegram_token: telegram_token
                })
                DataBus.retrievePosts()
            }

            return serverResponse.status
        } catch (e) {
            console.log("DataBus | retrieveUser() | Could not retrieve user information", e)
            return Api.STATUS_SERVER_ERROR
        }

    }

    static getUser({ctx}) {
        return ctx.session.user
    }


    static async submitPost({from_chat_id, message_id, date, is_poll}) {
        try {
            const serverResponse = await Api.submitPost({
                from_chat_id: from_chat_id,
                message_id: message_id,
                date: date,
                is_poll: is_poll
            })

            if (serverResponse.status === Api.STATUS_OK) {
                console.log("DataBus | submitPost() | saved successfully ")
                DataBus.retrievePosts()
            }

            return serverResponse.status
        } catch (e) {
            return Api.STATUS_SERVER_ERROR
        }

    }


    static async retrievePosts() {
        try {
            const serverResponse = await Api.retrievePosts()
            if (serverResponse.status === Api.STATUS_OK) {
                const allPosts = serverResponse.data
                const textPosts = allPosts.filter((post) => !post.is_poll)
                const polls = allPosts.filter((post) => post.is_poll)

                DataBus.updateTextPosts({posts: textPosts})
                DataBus.updatePolls({polls: polls})
            }

            return serverResponse.status
        } catch (e) {
            console.log("DataBus | retrievePosts() | Error! Could not retrieve posts", e)
            return Api.STATUS_SERVER_ERROR
        }
    }


    static async retrieveUserTimetable({ctx, chat_id, telegram_token}) {
        try {
            const serverResponse = await Api.retrieveTimetable({chat_id, telegram_token})

            if (serverResponse.status === Api.STATUS_OK) {
                const lessons = serverResponse.data
                ctx.session.userTimetable = lessons
            }

            return serverResponse.status

        } catch (e) {
            console.log("DataBus | retrieveUserTimetable() | Error! Could not timetable for the user", e)
            return Api.STATUS_SERVER_ERROR
        }
    }

    static getUserTimetable({ctx}) {
        return ctx.session.userTimetable
    }





    static updateTextPosts({posts}) {
        this.posts = posts
    }

    static updatePolls({polls}) {
        this.polls = polls
    }

}

module.exports = DataBus
