const {Telegraf, Scenes, session, Composer} = require("telegraf")
require("dotenv/config")
const constants = require("./constants")

const startSceneGenerate = require("./scenes/StartScene")
const mainMenuSceneGenerate = require("./scenes/MainMenuScene")
const educationSceneGenerate = require("./scenes/menuEducation/EducationScene")
const campusSceneGenerate = require("./scenes/menuEducation/subscenes/CampusScene")
const profileSceneGenerate = require("./scenes/menuProfile/ProfileScene")
const newsSceneGenerate = require("./scenes/menuNews/NewsScene")
const broadcastSceneGenerate = require("./scenes/menuNews/subscenes/BroadcastScene")
const askQuestionSceneGenerate = require("./scenes/menuNews/subscenes/AskQuestionScene")
const pollSceneGenerate = require("./scenes/menuNews/subscenes/PollScene")
const postSceneGenerate = require("./scenes/menuNews/subscenes/PostScene")
const channelSceneFunction = require("./scenes/ChannelScene")

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
    broadcastSceneGenerate(),
    askQuestionSceneGenerate(),
    pollSceneGenerate(),
    postSceneGenerate()
])

// Middlewares
bot.use(Telegraf.log())
bot.use(session())
bot.use(stage.middleware())


// Middleware: Check if chat type is private
bot.use(async (ctx, next) => ctx.chat && ctx.chat.type === "channel" ? await channelSceneFunction(ctx) : next())

bot.use((ctx, next) => ctx.chat && ctx.chat.type === "private" ? next() : ctx.reply(constants.TEXT_CHAT_NOT_PRIVATE))


// Commands
bot.start(async (ctx) => {
    await ctx.scene.enter(constants.SCENE_ID_START)
})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
