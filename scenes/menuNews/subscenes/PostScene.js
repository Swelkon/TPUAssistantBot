const { Scenes, Markup } = require('telegraf')
const constants = require("../../../constants")
const DataBus = require("../../../model/DataBus");



function postSceneGenerate() {
    const  postScene = new Scenes.BaseScene( constants.SCENE_ID_POSTS )
    postScene.enter( async (ctx) => {
        if (DataBus.posts.length === 0){
            await ctx.reply("Сори) не нашел новостей за неделю")
        } else {
            console.log("PostScene: trying to forward posts")
            for (const post of DataBus.posts) {
                console.log(post)
                await ctx.telegram.forwardMessage(ctx.chat.id, post.from_chat_id, post.message_id)
                await sleep(50)
            }
        }

        await ctx.scene.enter(constants.SCENE_ID_NEWS)
    })

    return  postScene
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports =  postSceneGenerate