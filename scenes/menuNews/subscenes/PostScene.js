const {Scenes, Markup} = require('telegraf')
const constants = require("../../../model/constants")
const DataBus = require("../../../model/DataBus")
const Api = require("../../../model/api/Api")
const defaultAct = require("../../../DefaultAct")

const POST_MARKUP = Markup.keyboard([[constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]]).resize(true)

function postSceneGenerate() {
    const postScene = new Scenes.BaseScene(constants.SCENE_ID_POSTS)
    postScene.enter(async (ctx) => {
        if (DataBus.posts.length === 0) {
            await ctx.reply("Сори) не нашел новостей за неделю", POST_MARKUP)
        } else {
            console.log("PostScene: trying to forward posts")
            for (const post of DataBus.posts) {
                console.log(post)
                try {
                    await ctx.telegram.forwardMessage(ctx.chat.id, post.from_chat_id, post.message_id)

                } catch (e) {
                    console.log(e)
                }
                await sleep(50)
            }
            await ctx.reply("Можете опубликовать свою собственную новость. Напишите ее обычным сообщением", POST_MARKUP)
        }

        //await ctx.scene.enter(constants.SCENE_ID_NEWS)
    })

    postScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    postScene.hears(constants.BUTTON_TEXT_BACK, async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    postScene.hears(constants.BUTTON_TEXT_START, async (ctx) => ctx.scene.enter(constants.SCENE_ID_START))


    postScene.on("message", async (ctx) => {
        ctx.reply("Отправить пост?", {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: Markup.inlineKeyboard([Markup.button.callback('Да', 'btn_yes'), Markup.button.callback('Нет', 'btn_no')]).resize(true).reply_markup
        })
        ctx.scene.state.from_chat_id = ctx.message.chat.id
        ctx.scene.state.message_id = ctx.message.message_id
        ctx.scene.state.date = ctx.message.date
        ctx.scene.state.is_poll = false
    })

    postScene.on("callback_query", async (ctx) => {
        ctx.answerCbQuery()
        if (ctx.callbackQuery?.data === 'btn_no') {
            await ctx.reply("Отправка отменена")
            return
        }

        if (ctx.callbackQuery?.data === 'btn_yes') {
            // Handle ServerResponse.status
            if (await DataBus.submitPost({
                telegram_token: DataBus.getUser({ctx}).telegram_token,
                from_chat_id: ctx.scene.state.from_chat_id,
                message_id: ctx.scene.state.message_id,
                date: ctx.scene.state.date,
                is_poll: ctx.scene.state.is_poll
            }) === Api.STATUS_OK) {

                DataBus.sendMessageToOthers({
                    ctx: ctx,
                    chat_id: ctx.chat.id,
                    telegram_token: DataBus.getUser({ctx}).telegram_token,
                    message_id: ctx.scene.state.message_id
                })
                await ctx.reply("Пост сохранен")

            } else {
                await ctx.reply("Не получилось опубликовать пост(")
            }

        }

    })


    defaultAct(postScene, constants.SCENE_ID_NEWS)
    return postScene
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = postSceneGenerate
