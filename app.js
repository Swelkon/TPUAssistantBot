const {Telegraf, Scenes, Markup, session} = require("telegraf")
require("dotenv/config")
const constants = require("./constants")
const mainMenuSceneGenerate = require("./scenes/MainMenuScene")

// Bot init
const bot = new Telegraf(process.env.BOT_TOKEN)


// Stages init
const stage = new Scenes.Stage([
    mainMenuSceneGenerate()
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


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



