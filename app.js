const {Telegraf, Scenes, session, Composer} = require("telegraf")
require("dotenv/config")
const constants = require("./constants")
const axios = require("axios")
const Api = require("./model/api/Api")

const mainMenuSceneGenerate = require("./scenes/MainMenuScene")
const newsSceneGenerate = require("./scenes/menuNews/NewsScene")
const educationSceneGenerate = require("./scenes/menuEducation/EducationScene")
const campusSceneGenerate = require("./scenes/menuEducation/CampusScene")
const profileSceneGenerate = require("./scenes/menuProfile/ProfileScene")
const broadcastSceneGenerate = require("./scenes/menuNews/BroadcastScene")

// Bot init
const bot = new Telegraf(process.env.BOT_TOKEN)

const api = new Api()


// Stages init
const stage = new Scenes.Stage([
    mainMenuSceneGenerate(),
    newsSceneGenerate(),
    educationSceneGenerate(),
    campusSceneGenerate(),
    profileSceneGenerate(),
    broadcastSceneGenerate()
])

// Middlewares
bot.use(Telegraf.log())
bot.use(session())
bot.use(stage.middleware())


// Middleware: Check if chat type is private
bot.use((ctx, next) => ctx.chat && ctx.chat.type !== "private" ? ctx.reply(constants.TEXT_CHAT_NOT_PRIVATE) : next())
// bot.use((ctx, next) => ctx.chat && ctx.chat.type === "channel" ? ctx.reply(ctx.channelPost.text) : next())
// bot.use((ctx, next) => ctx.chat && ctx.chat.type === "group" ? ctx.reply(ctx.g.text) : next())


// Commands
bot.start(async (ctx) => {
    await ctx.replyWithSticker(constants.STICKER_ID_HELLO)
    await ctx.reply(constants.TEXT_INTRODUCTION)
    await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
})

// bot.start(async (ctx) => {
//     try {
//         const serverResponse = await api.authorizeUser({chat_id: ctx.chat.id, access_token: 0})
//         if (serverResponse.status !== 0) {
//             await ctx.reply("Вы у нас впервый раз? Авторизируйтесь через почту ТПУ!")
//             await ctx.reply(`https://oauth.tpu.ru/authorize?client_id=23&redirect_uri=${api.SERVER_URL}/users/register&response_type=code&state=${ctx.chat.id}`)
//         } else {
//             const user = serverResponse.data
//             ctx.session.user = {
//                 _id: user._id,
//                 last_name: user.last_name,
//                 first_name: user.first_name,
//                 email: user.email,
//                 lichnost_id: user.lichnost_id,
//                 user_id: user.user_id,
//                 chat_id: user.telegram_chat_id,
//             }
//             await ctx.replyWithSticker(constants.STICKER_ID_HELLO)
//             await ctx.reply(constants.TEXT_INTRODUCTION)
//             await ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
//
//             ctx.session
//         }
//     } catch (e) {
//         console.log(e)
//
//     }
//
// })

bot.on("text", async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
bot.on("text", Composer.privateChat((ctx) => {
    ctx.reply("Only private")
}))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



