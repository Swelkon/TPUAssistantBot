const {Telegraf, Scenes, Markup, session} = require("telegraf")
require("dotenv/config")
const welcomeSceneGenerate = require("./scenes/sceneWelcome/WelcomeScene")
const campusSceneGenerate = require("./scenes/sceneCampus/CampusScene")
const {CONSTANTS, SCENE_IDS} = require("./constants")

// Bot init
const bot = new Telegraf(process.env.BOT_TOKEN)


// Stages init
const stage = new Scenes.Stage([
    welcomeSceneGenerate(),
    campusSceneGenerate()
])

// Middlewares
bot.use(Telegraf.log())
bot.use(session())
bot.use(stage.middleware())


// Middleware: Check if chat type is private
bot.use((ctx, next) => ctx.chat && ctx.chat.type !== "private" ? ctx.reply(CONSTANTS.TEXT_CHAT_NOT_PRIVATE) : next())


// Commands
bot.start(async (ctx) => {
    await ctx.scene.enter(SCENE_IDS.WELCOME)
})

bot.hears(CONSTANTS.BUTTON_TEXT_HELLO, async (ctx) => {
    await ctx.reply("Привет еще раз", {
        reply_markup: Markup.removeKeyboard().reply_markup
    })
})

bot.command('loc', async (ctx) =>
    await ctx.scene.enter(SCENE_IDS.CAMPUS))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



