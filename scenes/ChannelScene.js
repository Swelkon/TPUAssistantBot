const {Scenes, Markup} = require('telegraf')
const Api = require("../model/api/Api");
const DataBus = require("../model/DataBus");


async function channelSceneFunction(ctx) {
    if (DataBus.allowedChannels.includes(ctx.chat.id)){
        try{
            if (ctx.channelPost) {
                if (ctx.channelPost.poll) {
                    const serverResponse = await Api.submitPost({
                        from_chat_id: ctx.channelPost.sender_chat.id,
                        message_id: ctx.channelPost.message_id,
                        date: ctx.channelPost.date,
                        is_poll: true
                    })

                    serverResponse.status === Api.STATUS_OK ? console.log("Channel poll saved", serverResponse.data) : console.log("Channel poll hasn't been saved", serverResponse.data)

                } else {
                    const serverResponse = await Api.submitPost({
                        from_chat_id: ctx.channelPost.sender_chat.id,
                        message_id: ctx.channelPost.message_id,
                        date: ctx.channelPost.date,
                        is_poll: false
                    })
                    serverResponse.status === Api.STATUS_OK ? console.log("Channel post saved", serverResponse.data) : console.log("Channel post hasn't been saved", serverResponse.data)
                }

                DataBus.updatePosts()
            }{

            }

        }catch (e) {
            console.log("Error, could not save the post", e)
            await ctx.reply("Не смог сохранить пост")
        }
    }
}

module.exports = channelSceneFunction