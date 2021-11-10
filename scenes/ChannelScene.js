const { Scenes, Markup } = require('telegraf')
const constants = require("../constants")
const DataBus = require("../model/DataBus");



async function channelSceneFunction(ctx) {
    if (ctx.channelPost) {
        if (ctx.channelPost.poll){
            console.log("Channel post!!! Trying to save")
            DataBus.addPoll({from_chat_id: ctx.channelPost.sender_chat.id, message_id: ctx.channelPost.message_id})
            console.log("Channel post saved", DataBus.polls)
        }

        // await ctx.telegram.forwardMessage(819382563, ctx.channelPost.sender_chat.id, )
    }
}

module.exports =  channelSceneFunction