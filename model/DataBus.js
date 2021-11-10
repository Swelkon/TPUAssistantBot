const User = require('./data/User')
const Api = require('./api/Api')

class DataBus {

    static get numOfNews() {
        return DataBus.polls.length + DataBus.posts.length
    }

    static polls = []
    static posts = []

    static setUser({ctx, user, chat_id, access_token}) {
        ctx.session.user = new User({
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email,
            lichnost_id: user.lichnost_id,
            user_id: user.user_id,
            chat_id: chat_id,
            access_token: access_token
        })
    }

    static getUser({ctx}) {
        return ctx.session.user
    }

    static updateTextPosts({posts}){
        this.posts = posts
    }

    static updatePolls({polls}){
        this.polls = polls
    }

    static async updatePosts(){
        const serverResponse = await Api.getTestPosts()
        if (serverResponse.status === Api.STATUS_OK) {
            console.log("ChannelScene: updating posts")
            const allPosts = serverResponse.data
            const textPosts = allPosts.filter((post) => !post.is_poll)
            const polls = allPosts.filter((post) => post.is_poll)

            DataBus.updateTextPosts({posts: textPosts})
            DataBus.updatePolls({polls: polls})
        }
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