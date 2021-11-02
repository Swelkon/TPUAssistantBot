const {Scenes, Markup} = require('telegraf')
const constants = require("../constants")
const Api = require("../model/api/Api")
const DataBus = require("../model/DataBus")


// Scene generate
function startSceneGenerate() {
    const startScene = new Scenes.BaseScene(constants.SCENE_ID_START)

    // On Enter
    startScene.enter(async (ctx) => {
        // Try to get user
        try {
            // Check if access_token is provided
            const access_token = ctx.message.text.split(" ")[1]
            const chat_id = ctx.chat.id

            const serverResponse = await Api.authorizeUser({
                chat_id: chat_id,
                access_token: access_token
            })

            // If status if not OK
            if (serverResponse.status !== Api.STATUS_OK) {
                await ctx.reply("Вы у нас в первый раз? Авторизируйтесь через почту ТПУ!")
                await ctx.reply(Api.getRegistrationURL({chat_id: chat_id}))
            } else {
                // DataBus set ctx.session.user
                DataBus.setUser({ctx: ctx, user: serverResponse.data, chat_id: chat_id, access_token: access_token})

                await ctx.replyWithSticker(constants.STICKER_ID_HELLO)
                await ctx.reply(constants.TEXT_INTRODUCTION)
                await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
            }
        } catch (e) {
            console.log(e)
        }
    })

    return startScene
}

module.exports = startSceneGenerate