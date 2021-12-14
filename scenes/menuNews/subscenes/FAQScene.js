const { Scenes, Markup} = require('telegraf')
const constants = require("../../../model/constants")
const defaultAct = require("../../../DefaultAct")

const FAQ_MARKUP = Markup.keyboard([
    [constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]
]).resize(true)

const topics = ["стипендии", "работа деканата", "и т.д."]

function faqSceneGenerate() {
    const faqScene = new Scenes.BaseScene( constants.SCENE_ID_FAQ )

    faqScene.enter( async (ctx) => {
        await ctx.reply("Можешь задать мне вопрос ;)", FAQ_MARKUP)
        let msg = "Я могу помочь с некоторыми вопросами про:"
        topics.forEach((topic) => {
            msg += `- ${topic};\n`
        })
        await ctx.reply(msg)

    })


    defaultAct(faqScene, constants.SCENE_ID_NEWS)
    return faqScene
}

module.exports = faqSceneGenerate