const { Scenes, Markup } = require('telegraf')
const constants = require("../constants")

const MAIN_MENU_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_NEWS,
    constants.BUTTON_TEXT_TIMETABLE,
    constants.BUTTON_TEXT_EDUCATION,
    constants.BUTTON_TEXT_PROFILE,
]).resize(true)

function mainMenuSceneGenerate() {
    const  mainMenuScene = new Scenes.BaseScene( constants.SCENE_ID_MAIN_MENU )

    mainMenuScene.enter( async (ctx) => {
        await ctx.reply(constants.TEXT_MAIN_MENU, {
            reply_markup: MAIN_MENU_MARKUP.reply_markup
        })
    })

    mainMenuScene.hears(constants.BUTTON_TEXT_NEWS, async (ctx) => {})
    mainMenuScene.hears(constants.BUTTON_TEXT_TIMETABLE, async (ctx) => {})
    mainMenuScene.hears(constants.BUTTON_TEXT_EDUCATION, async (ctx) => ctx.scene.enter(constants.SCENE_ID_EDUCATION))
    mainMenuScene.hears(constants.BUTTON_TEXT_PROFILE, async (ctx) => ctx.scene.enter(constants.SCENE_ID_PROFILE))

    mainMenuScene.on("message", async (ctx) => ctx.reply("Выберите пункт из меню"))

    return  mainMenuScene
}

module.exports =  mainMenuSceneGenerate