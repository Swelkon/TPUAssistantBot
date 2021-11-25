const {Scenes, Markup} = require('telegraf')
const Api = require("../model/api/Api");
const DataBus = require("../model/DataBus");


async function channelSceneFunction(ctx) {
    //TODO: Проверка канала ТПУ должна проходить на сервере
    if (DataBus.allowedChannels.includes(ctx.chat.id)) {

        if (ctx.channelPost) {
            if (ctx.channelPost.poll) {

                // Handle ServerResponse.status
                switch (await DataBus.submitPost({
                    from_chat_id: ctx.channelPost.sender_chat.id,
                    message_id: ctx.channelPost.message_id,
                    date: ctx.channelPost.date,
                    is_poll: true
                })) {
                    case Api.STATUS_OK:
                        console.log("ChannelSceneFunction() | Channel poll saved")
                        break
                    default:
                        console.log("ChannelSceneFunction() | Channel poll hasn't been saved")
                        break

                }

            } else {
                // Handle ServerResponse.status
                switch (await DataBus.submitPost({
                    from_chat_id: ctx.channelPost.sender_chat.id,
                    message_id: ctx.channelPost.message_id,
                    date: ctx.channelPost.date,
                    is_poll: false
                })) {
                    case Api.STATUS_OK:
                        console.log("ChannelSceneFunction() | Channel post saved")
                        break
                    default:
                        console.log("ChannelSceneFunction() | Channel post hasn't been saved")
                        break

                }
            }
        }
        // try {
        //     if (ctx.channelPost) {
        //         if (ctx.channelPost.poll) {
        //
        //             const serverResponse = await Api.submitPost({
        //                 from_chat_id: ctx.channelPost.sender_chat.id,
        //                 message_id: ctx.channelPost.message_id,
        //                 date: ctx.channelPost.date,
        //                 is_poll: true
        //             })
        //
        //             serverResponse.status === Api.STATUS_OK ? console.log("Channel poll saved", serverResponse.data) : console.log("Channel poll hasn't been saved", serverResponse.data)
        //
        //         } else {
        //             const serverResponse = await Api.submitPost({
        //                 from_chat_id: ctx.channelPost.sender_chat.id,
        //                 message_id: ctx.channelPost.message_id,
        //                 date: ctx.channelPost.date,
        //                 is_poll: false
        //             })
        //             serverResponse.status === Api.STATUS_OK ? console.log("Channel post saved", serverResponse.data) : console.log("Channel post hasn't been saved", serverResponse.data)
        //         }
        //
        //         DataBus.updatePosts()
        //     }
        //     {
        //
        //     }
        //
        // } catch (e) {
        //     console.log("Error, could not save the post", e)
        //     await ctx.reply("Не смог сохранить пост")
        // }
    }
}

module.exports = channelSceneFunction