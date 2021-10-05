const { Scenes, Markup } = require("telegraf")
const constants = require("../../constants")

const markup = Markup.keyboard([
    constants.BUTTON_TEXT_HELLO
]).resize(true)


function welcomeSceneGenerate(){

    // Create
    const welcomeScene = new Scenes.BaseScene(constants.SCENE_ID_WELCOME)

    // Enter
    welcomeScene.enter( async (ctx) => {
        await ctx.replyWithSticker("CAACAgIAAxkBAAIJj2FLk06bEFWfhI1_-CiwZFA80Fh-AAJcBAACnNbnClokfVuRQO25IQQ")
        await ctx.reply(constants.INTRODUCTION)
    })

    // On text
    welcomeScene.on("text", async (ctx, next) => {
        const name = ctx.message.text
        await ctx.reply(`Приятно познакомиться, ${name}`)
        next()
    })

    welcomeScene.on("text", async (ctx) => {
        await ctx.reply("Ну а меня зовут ... ну ты уже прочитал, наверное. Бот-ассистент)")
        await ctx.scene.leave()
    })


    // On leave
    welcomeScene.leave( async (ctx) => {
        await ctx.reply("Выход из WelcomeScene", {
            reply_markup: markup.reply_markup
        })
    })

    return welcomeScene
}

module.exports = welcomeSceneGenerate
