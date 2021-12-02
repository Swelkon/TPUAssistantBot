const {Scenes, Markup} = require('telegraf')
const constants = require("../constants")
const Api = require("../model/api/Api")
const DataBus = require("../model/DataBus")

const REMOVE_MARKUP = Markup.removeKeyboard()

// Scene generate
function startSceneGenerate() {
    const startScene = new Scenes.BaseScene(constants.SCENE_ID_START)

    // On Enter
    startScene.enter(async (ctx) => {
        // await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
        const telegram_token = ctx.message.text.split(" ")[1]
        const chat_id = ctx.chat.id

        // Handle ServerResponse.status
        switch (await DataBus.retrieveUser({ctx: ctx, chat_id: chat_id, telegram_token: telegram_token})) {
            case Api.STATUS_OK:
                await ctx.replyWithSticker(constants.STICKER_ID_HELLO)
                await ctx.reply(constants.TEXT_INTRODUCTION)
                await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
                break
            // case Api.STATUS_SERVER_ERROR:
            //     await ctx.reply('Упс, извините, проблемы с сервером, попробуйте еще раз')
            //     await ctx.scene.reenter()
            default:
                await ctx.reply("Вы у нас в первый раз? Авторизируйтесь через почту ТПУ!", REMOVE_MARKUP)
                await ctx.reply(Api.getRegistrationURL({chat_id: chat_id}))
        }

    })

    return startScene
}

module.exports = startSceneGenerate
