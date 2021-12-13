const { Scenes, Markup } = require('telegraf')
const constants = require("../../../model/constants")
const DataBus = require("../../../model/DataBus")
const channelSceneFunction = require("../../ChannelScene")
const Api = require("../../../model/api/Api")
const defaultAct = require("../../../DefaultAct")

const POST_MARKUP = Markup.keyboard([[constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]]).resize(true)

function postSceneGenerate() {
    const  postScene = new Scenes.BaseScene( constants.SCENE_ID_POSTS )
    postScene.enter( async (ctx) => {
        if (DataBus.posts.length === 0){
            await ctx.reply("Сори) не нашел новостей за неделю", POST_MARKUP)
        } else {
            console.log("PostScene: trying to forward posts")
            for (const post of DataBus.posts) {
                console.log(post)
                await ctx.telegram.forwardMessage(ctx.chat.id, post.from_chat_id, post.message_id)
                await sleep(50)
            }
            await ctx.reply("Можете опубликовать свою собственную новость. Напишите его обычным сообщением", POST_MARKUP)
        }

        //await ctx.scene.enter(constants.SCENE_ID_NEWS)
    })


    postScene.on( "message", async (ctx) => {
        ctx.reply("Отправить пост?", {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: Markup.inlineKeyboard([Markup.button.callback('Да', 'btn_yes'), Markup.button.callback('Нет', 'btn_no')]).resize(true).reply_markup
        })
        ctx.scene.state.from_chat_id = ctx.message.chat.id
        ctx.scene.state.message_id = ctx.message.message_id
        ctx.scene.state.date = ctx.message.date
        ctx.scene.state.is_poll = false
    } )

    postScene.on("callback_query", async (ctx) => {
        switch (ctx.callbackQuery?.data){
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
                        await ctx.reply("Пост сохранен")
                        break
                    default:
                        await ctx.reply("Не получилось опубликовать пост(")
                        break
                }

                break
            default:
                await ctx.reply("Отправка отменена")
                // await ctx.answerCbQuery(ctx.callbackQuery)
        }
    })


    defaultAct(postScene, constants.SCENE_ID_NEWS)
    return  postScene
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports =  postSceneGenerate


// const serverResponse = await Api.submitPost({
//     from_chat_id: ctx.scene.state.from_chat_id,
//     message_id: ctx.scene.state.message_id,
//     date: ctx.scene.state.date,
//     is_poll: ctx.scene.state.is_poll
// })
//
// serverResponse.status === Api.STATUS_OK ? console.log("Channel post saved", serverResponse.data) : console.log("Channel poll hasn't been saved", serverResponse.data)
// serverResponse.status === Api.STATUS_OK ? await ctx.reply("Пост сохранен") : await ctx.reply("Не получилось отправить пост(")
// DataBus.updatePosts()
