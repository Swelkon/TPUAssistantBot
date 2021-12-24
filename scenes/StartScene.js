const {Scenes, Markup} = require('telegraf')
const constants = require("../model/constants")
const Api = require("../model/api/Api")
const DataBus = require("../model/DataBus")
const REMOVE_MARKUP = Markup.removeKeyboard()

// генерация сцены старта
function startSceneGenerate() {
    const startScene = new Scenes.BaseScene(constants.SCENE_ID_START)

    // вход в сцену
    startScene.enter(async (ctx) => {
        // await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
        const telegram_token = ctx.message.text.split(" ")[1]
        // const chat_id = ctx.chat.id
        // const user = DataBus.getUser({ctx})

        // Handle ServerResponse.status

        // запрос на получение данных о пользователе через api
        switch (await DataBus.retrieveUser({
            ctx: ctx,
            chat_id: ctx.chat.id,
            // telegram_token: user ? user.telegram_token : telegram_token
            telegram_token: telegram_token
        })) {
            // если успешно, то запрос на данные о студенте через api и приветствие пользователя
            case Api.STATUS_OK:
                DataBus.retrieveStudentInfo({
                    ctx: ctx,
                    chat_id: ctx.chat.id,
                    // telegram_token: user ? user.telegram_token : telegram_token
                    telegram_token: telegram_token
                })
                await ctx.replyWithSticker(constants.STICKER_ID_HELLO)
                await ctx.reply(constants.TEXT_INTRODUCTION)
                await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
                break

            // если ошибка, то информирование пользователя об этом и повторный вход в сцену
            // case Api.STATUS_SERVER_ERROR:
            //     await ctx.reply('Упс, извините, проблемы с сервером, попробуйте еще раз')
            //     await ctx.scene.reenter()

            // иначе предложение пройти авторизацию
            default:
                await ctx.reply("Вы у нас в первый раз? Авторизируйтесь через почту ТПУ!", REMOVE_MARKUP)
                await ctx.reply(Api.getRegistrationURL({chat_id: ctx.chat.id}))
        }
    })

    return startScene
}

module.exports = startSceneGenerate
