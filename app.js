const {Telegraf, Scenes, session, Composer} = require("telegraf")
require("dotenv/config")
const constants = require("./constants")
const axios = require("axios");
const Api = require("./model/api/Api")

const startSceneGenerate = require("./scenes/menuStart/StartScene")
const mainMenuSceneGenerate = require("./scenes/MainMenuScene")
const educationSceneGenerate = require("./scenes/menuEducation/EducationScene")
const campusSceneGenerate = require("./scenes/menuEducation/CampusScene")
const profileSceneGenerate = require("./scenes/menuProfile/ProfileScene")

// Bot init
// const bot = new Telegraf(process.env.BOT_TOKEN)
const bot = new Telegraf("2057283260:AAGhr7QLhID8Dtp9-owkcFS1tr0Jpf5Innw")

const api = new Api()


// Stages init
const stage = new Scenes.Stage([
    startSceneGenerate(),
    mainMenuSceneGenerate(),
    educationSceneGenerate(),
    campusSceneGenerate(),
    profileSceneGenerate()
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
    await ctx.scene.enter(constants.SCENE_ID_START)
})


// bot.on("text", async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
// bot.on("text", Composer.privateChat((ctx) => {
//     ctx.reply("Only private")
// }))


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
