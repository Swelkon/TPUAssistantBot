const {Scenes, Markup} = require('telegraf')
const constants = require("../../constants")

function startSceneGenerate() {
    const startScene = new Scenes.BaseScene(constants.SCENE_ID_START)
    startScene.enter(async (ctx) => {
        await ctx.replyWithSticker(constants.STICKER_ID_HELLO)
        await ctx.reply(constants.TEXT_INTRODUCTION)
        await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)

        // try {
        //     console.log(ctx.message.text.split(" ")[1])   // access token
        //     const serverResponse = await api.authorizeUser({chat_id: ctx.chat.id, access_token: ctx.message.text.split(" ")[1]})
        //     if (serverResponse.status !== 0) {
        //         await ctx.reply("Вы у нас в первый раз? Авторизируйтесь через почту ТПУ!")
        //         await ctx.reply(`https://oauth.tpu.ru/authorize?client_id=23&redirect_uri=${api.SERVER_URL}/users/register&response_type=code&state=${ctx.chat.id}`)
        //     } else {
        //         const user = serverResponse.data
        //         ctx.session.user = {
        //             _id: user._id,
        //             last_name: user.last_name,
        //             first_name: user.first_name,
        //             email: user.email,
        //             lichnost_id: user.lichnost_id,
        //             user_id: user.user_id,
        //             chat_id: user.telegram_chat_id,
        //         }
        //         await ctx.replyWithSticker(constants.STICKER_ID_HELLO)
        //         await ctx.reply(constants.TEXT_INTRODUCTION)
        //         await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)

        //         ctx.session
        //     }
        // } catch (e) {
        //     console.log(e)
        // }
    })

    return startScene
}

module.exports = startSceneGenerate