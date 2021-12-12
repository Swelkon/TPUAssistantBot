const {Scenes, Markup} = require('telegraf')
const constants = require("../../../model/constants")
const DataBus = require("../../../model/DataBus")
const channelSceneFunction = require("../../ChannelScene")
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
                await ctx.telegram.forwardMessage(ctx.chat.id, poll.from_chat_id, poll.message_id)
                await sleep(50)
            }
            await ctx.reply("Можете создать свое собственное голосование, отпавьте его мне", POLL_MARKUP)
        }

        // await ctx.scene.enter(constants.SCENE_ID_NEWS)
    })

    defaultAct(pollScene, constants.SCENE_ID_NEWS)

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
        switch (ctx.callbackQuery?.data) {
            case 'btn_yes':
                ctx.answerCbQuery()

                // Handle ServerResponse.status
                switch (await DataBus.submitPost({
                    from_chat_id: ctx.scene.state.from_chat_id,
                    message_id: ctx.scene.state.message_id,
                    date: ctx.scene.state.date,
                    is_poll: ctx.scene.state.is_poll
                })) {
                    case Api.STATUS_OK:
                        await ctx.reply("Голосование отправлено")
                        break
                    default:
                        await ctx.reply("Не смог сохранить ваше голосование(")
                        break
                }
                break

            default:
                ctx.answerCbQuery()
                await ctx.reply("Отправка отменена")
            //await ctx.answerCbQuery(ctx.callbackQuery)
        }
    })

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