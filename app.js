const {Telegraf, Scenes, session, Composer} = require("telegraf")
require("dotenv/config")
const constants = require("./model/constants")

const startSceneGenerate = require("./scenes/StartScene")
const mainMenuSceneGenerate = require("./scenes/MainMenuScene")
const educationSceneGenerate = require("./scenes/menuEducation/EducationScene")
const campusSceneGenerate = require("./scenes/menuEducation/subscenes/CampusScene")
const profileSceneGenerate = require("./scenes/menuProfile/ProfileScene")
const newsSceneGenerate = require("./scenes/menuNews/NewsScene")
const broadcastSceneGenerate = require("./scenes/menuNews/subscenes/BroadcastScene")
const askQuestionSceneGenerate = require("./scenes/menuNews/subscenes/AskQuestionScene")
const faqSceneGenerate = require("./scenes/menuNews/subscenes/FAQScene")
const pollSceneGenerate = require("./scenes/menuNews/subscenes/PollScene")
const postSceneGenerate = require("./scenes/menuNews/subscenes/PostScene")
const timetableSceneGenerate = require("./scenes/menuTimetable/TimetableScene")
const channelSceneFunction = require("./scenes/ChannelScene")
const vacancySceneGenerate = require("./scenes/menuNews/subscenes/VacancyScene")
const {log} = require("nodemon/lib/utils");

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
    postSceneGenerate(),
    faqSceneGenerate(),
    timetableSceneGenerate(),
    vacancySceneGenerate()
])

// Middlewares
bot.use(Telegraf.log())
bot.use(session())
bot.use(stage.middleware())


// Middleware: Check if chat type is private
// bot.use( async (ctx, next) => {
//     ctx.telegram.sendMessage(-1001614453874, "hi I am a bot")
//     next()
// })
bot.use(async (ctx, next) => (ctx.message && ctx.message.left_chat_member || ctx.myChatMember && ctx.myChatMember.new_chat_member) ? console.log("MyChatMember", ctx.myChatMember) : next())

bot.use(async (ctx, next) => ctx.chat && ctx.chat.type === "channel" ? await channelSceneFunction(ctx) : next())

// bot.use((ctx, next) => ctx.chat && ctx.chat.type === "private" ? next() : ctx.reply(constants.TEXT_CHAT_NOT_PRIVATE))
bot.use((ctx, next) => ctx.chat && ctx.chat.type === "private" ? next() : console.log("accepted in group or channel"))


// Commands
bot.start(async (ctx) => {
    await ctx.scene.enter(constants.SCENE_ID_START)
})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
