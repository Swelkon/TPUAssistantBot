const { Scenes, Markup } = require('telegraf')
const constants = require("../model/constants")
const format = require("string-format")
const DataBus = require("../model/DataBus");
const Api = require("../model/api/Api");

format.extend(String.prototype, {})

// const MAIN_MENU_MARKUP = Markup.keyboard([
//     constants.BUTTON_TEXT_NEWS.format(DataBus.polls.length),
//     constants.BUTTON_TEXT_TIMETABLE,
//     constants.BUTTON_TEXT_EDUCATION,
//     constants.BUTTON_TEXT_PROFILE,
// ]).resize(true)

function getMainMenuMarkup(){
    if (DataBus.numOfNews === 0){
        return Markup.keyboard([
            constants.BUTTON_TEXT_ZERO_NEWS,
            constants.BUTTON_TEXT_TIMETABLE,
            // constants.BUTTON_TEXT_EDUCATION,
            constants.BUTTON_TEXT_CAMPUS,
            constants.BUTTON_TEXT_PROFILE,
        ]).resize(true)
    } else {
        return Markup.keyboard([
            constants.BUTTON_TEXT_NEWS.format(DataBus.numOfNews),
            constants.BUTTON_TEXT_TIMETABLE,
            // constants.BUTTON_TEXT_EDUCATION,
            constants.BUTTON_TEXT_CAMPUS,
            constants.BUTTON_TEXT_PROFILE,
        ]).resize(true)
    }
}

function mainMenuSceneGenerate() {
    const  mainMenuScene = new Scenes.BaseScene( constants.SCENE_ID_MAIN_MENU )

    mainMenuScene.enter( async (ctx) => {

        await ctx.reply(constants.TEXT_MAIN_MENU, {
            reply_markup: getMainMenuMarkup().reply_markup
        })

    })

    // mainMenuScene.hears(constants.BUTTON_TEXT_NEWS, async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    mainMenuScene.hears(new RegExp('Новости'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    mainMenuScene.hears(constants.BUTTON_TEXT_TIMETABLE, async (ctx) => ctx.scene.enter(constants.SCENE_ID_TIMETABLE))
    // mainMenuScene.hears(constants.BUTTON_TEXT_EDUCATION, async (ctx) => ctx.scene.enter(constants.SCENE_ID_EDUCATION))
    mainMenuScene.hears(constants.BUTTON_TEXT_CAMPUS, async (ctx) => ctx.scene.enter(constants.SCENE_ID_CAMPUS))
    mainMenuScene.hears(constants.BUTTON_TEXT_PROFILE, async (ctx) => ctx.scene.enter(constants.SCENE_ID_PROFILE))
    mainMenuScene.on("message", async (ctx) => ctx.reply("Выберите пункт из меню"))

    return  mainMenuScene
}

module.exports =  mainMenuSceneGenerate