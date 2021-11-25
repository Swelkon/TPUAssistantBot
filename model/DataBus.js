const User = require('./data/User')
const Api = require('./api/Api')

class DataBus {

    static get numOfNews() {
        return DataBus.polls.length + DataBus.posts.length
    }

    static polls = []
    static posts = []
    static allowedChannels = [-1001614453874]

    static setUser({ctx, user, chat_id, access_token}) {
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
            access_token: access_token
        })
    }

    static getUser({ctx}){
        return ctx.session.user
    }

    static updateTextPosts({posts}){
        this.posts = posts
    }

    static updatePolls({polls}){
        this.polls = polls
    }

    static async updatePosts(){
        try {
            const serverResponse = await Api.retrievePosts()
            if (serverResponse.status === Api.STATUS_OK) {
                const allPosts = serverResponse.data
                const textPosts = allPosts.filter((post) => !post.is_poll)
                const polls = allPosts.filter((post) => post.is_poll)

                DataBus.updateTextPosts({posts: textPosts})
                DataBus.updatePolls({polls: polls})
            }
        } catch (e) {
            console.log("Error! Could not retrieve posts")
        }
    }

    static async updateTimetable({ctx, chat_id, access_token}){
        try {
            const serverResponse = await Api.retrieveTimetable({chat_id, access_token})
            if (serverResponse.status === Api.STATUS_OK) {
                const lessons = serverResponse.data
                ctx.session.lessons = lessons
            }
        } catch (e) {
            console.log("Error! Could not retrieve posts")
        }
    }

    static getLessons({ctx}){
        return ctx.session.lessons
    }

}

module.exports = DataBus





// static addPoll({from_chat_id, message_id, date}) {
//     this.polls.push({
//         from_chat_id: from_chat_id,
//         message_id: message_id,
//         date: date
//     })
// }
//
//
// static addPost({from_chat_id, message_id, date}) {
//     this.posts.push({
//         from_chat_id: from_chat_id,
//         message_id: message_id,
//         date: date
//     })
// }