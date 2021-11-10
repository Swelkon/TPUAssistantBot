const { Scenes, Markup } = require('telegraf')
const constants = require("../../../constants")
const DataBus = require("../../../model/DataBus");



function pollSceneGenerate() {
    const  pollScene = new Scenes.BaseScene( constants.SCENE_ID_POLLS )

    pollScene.enter( async (ctx) => {
        if (DataBus.polls.length === 0){
            await ctx.reply("Сори) не нашел ни одного активного голосования")
        } else {
            console.log("PollScene: trying to forward polls")
            for (const poll of DataBus.polls) {
                console.log(poll)
                await ctx.telegram.forwardMessage(ctx.chat.id, poll.from_chat_id, poll.message_id)
                await sleep(50)
            }
        }

        await ctx.scene.enter(constants.SCENE_ID_NEWS)
    })

    return  pollScene
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports =  pollSceneGenerate