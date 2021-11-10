const {Scenes, Markup} = require('telegraf')
const constants = require("../../constants")
const format = require("string-format")
const DataBus = require("../../model/DataBus");

format.extend(String.prototype, {})

// const NEWS_MARKUP = Markup.keyboard([
//     constants.BUTTON_TEXT_POLLS.format(DataBus.polls.length),
//     constants.BUTTON_TEXT_BROADCAST,
//     constants.BUTTON_TEXT_ASK_QUESTION,
//     constants.BUTTON_TEXT_MAIN_MENU
// ]).resize()

function getNewsMarkup() {
    return Markup.keyboard([
        constants.BUTTON_TEXT_POLLS.format(DataBus.polls.length),
        constants.BUTTON_TEXT_BROADCAST,
        constants.BUTTON_TEXT_ASK_QUESTION,
        constants.BUTTON_TEXT_MAIN_MENU
    ]).resize()
}

function newsSceneGenerate() {
    const newsScene = new Scenes.BaseScene(constants.SCENE_ID_NEWS)

    newsScene.enter(async (ctx) => await ctx.reply('Раздел "Новости"', getNewsMarkup()))


    newsScene.hears(new RegExp('^Голосования'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_POLLS))
    newsScene.hears(constants.BUTTON_TEXT_BROADCAST, async (ctx) => ctx.scene.enter(constants.SCENE_ID_BROADCAST))
    newsScene.hears(constants.BUTTON_TEXT_ASK_QUESTION, async (ctx) => ctx.scene.enter(constants.SCENE_ID_ASK_QUESTION))
    newsScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))

    return newsScene
}

module.exports = newsSceneGenerate