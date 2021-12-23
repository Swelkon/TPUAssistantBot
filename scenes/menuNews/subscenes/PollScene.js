const {Scenes, Markup} = require('telegraf')
const constants = require("../../../model/constants")
const DataBus = require("../../../model/DataBus")
const Api = require("../../../model/api/Api")
// const Api = require("../model/api/Api")
const defaultAct = require("../../../DefaultAct")

const POLL_MARKUP = Markup.keyboard([[constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]]).resize(true)

function pollSceneGenerate() {
    const pollScene = new Scenes.BaseScene(constants.SCENE_ID_POLLS)

    pollScene.enter(async (ctx) => {
        if (DataBus.polls.length === 0) {
            await ctx.reply("Сори) не нашел ни одного активного голосования, но Вы можете запостить самое первое голосование", POLL_MARKUP)
        } else {
            console.log("PollScene: trying to forward polls")
            for (const poll of DataBus.polls) {
                console.log(poll)
                try {
                    await ctx.telegram.forwardMessage(ctx.chat.id, poll.from_chat_id, poll.message_id)

                } catch (e) {
                    console.log(e)
                }
                await sleep(50)
            }
            await ctx.reply("Можете создать свое собственное голосование, отпавьте его мне", POLL_MARKUP)
        }

        // await ctx.scene.enter(constants.SCENE_ID_NEWS)
    })


    pollScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    pollScene.hears(constants.BUTTON_TEXT_BACK, async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    pollScene.hears(constants.BUTTON_TEXT_START, async (ctx) => ctx.scene.enter(constants.SCENE_ID_START))

    pollScene.on("poll", async (ctx) => {
        ctx.reply("Отправить пост?", {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: Markup.inlineKeyboard([Markup.button.callback('Да', 'btn_yes'), Markup.button.callback('Нет', 'btn_no')]).resize(true).reply_markup
        })

        ctx.scene.state.from_chat_id = ctx.message.chat.id
        ctx.scene.state.message_id = ctx.message.message_id
        ctx.scene.state.date = ctx.message.date
        ctx.scene.state.is_poll = true
    })

    pollScene.on("callback_query", async (ctx) => {
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
                await ctx.reply("Голосование отправлено")

            } else {
                await ctx.reply("Не смог сохранить ваше голосование(")
            }


        }

    })

    defaultAct(pollScene, constants.SCENE_ID_NEWS)
    return pollScene
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = pollSceneGenerate


// const serverResponse = await Api.submitPost({
//     from_chat_id: ctx.scene.state.from_chat_id,
//     message_id: ctx.scene.state.message_id,
//     date: ctx.scene.state.date,
//     is_poll: ctx.scene.state.is_poll
// })
//
// serverResponse.status === Api.STATUS_OK ? console.log("Channel poll saved", serverResponse.data) : console.log("Channel poll hasn't been saved", serverResponse.data)
// serverResponse.status === Api.STATUS_OK ? await ctx.reply("Голосование отправлено") : await ctx.reply("Не смог сохранить ваше голосование(")
// DataBus.updatePosts()