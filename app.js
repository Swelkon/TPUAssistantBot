const {Telegraf, Scenes, session, Composer} = require("telegraf")
require("dotenv/config")
const constants = require("./constants")

const startSceneGenerate = require("./scenes/StartScene")
const mainMenuSceneGenerate = require("./scenes/MainMenuScene")
const educationSceneGenerate = require("./scenes/menuEducation/EducationScene")
const campusSceneGenerate = require("./scenes/menuEducation/CampusScene")
const profileSceneGenerate = require("./scenes/menuProfile/ProfileScene")
const newsSceneGenerate = require("./scenes/menuNews/NewsScene")
const broadcastSceneGenerate = require("./scenes/menuNews/BroadcastScene")

// Bot init
const bot = new Telegraf(process.env.BOT_TOKEN)


// Stages init
const stage = new Scenes.Stage([
    startSceneGenerate(),
    mainMenuSceneGenerate(),
    educationSceneGenerate(),
    campusSceneGenerate(),
    profileSceneGenerate(),
    newsSceneGenerate(),
    broadcastSceneGenerate()
])

// Middlewares
bot.use(Telegraf.log())
bot.use(session())
bot.use(stage.middleware())


// Middleware: Check if chat type is private
bot.use((ctx, next) => ctx.chat && ctx.chat.type !== "private" ? ctx.reply(constants.TEXT_CHAT_NOT_PRIVATE) : next())


// Commands
bot.start(async (ctx) => {
    await ctx.scene.enter(constants.SCENE_ID_START)
})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
