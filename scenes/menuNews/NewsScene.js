const {Scenes, Markup} = require('telegraf')
const constants = require("../../constants")

const NEWS_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_BROADCAST,
    constants.BUTTON_TEXT_MAIN_MENU
]).resize()

function newsSceneGenerate() {
    const newsScene = new Scenes.BaseScene(constants.SCENE_ID_NEWS)

    newsScene.enter(async (ctx) => await ctx.reply('Раздел "Новости"', NEWS_MARKUP))

    newsScene.hears(constants.BUTTON_TEXT_BROADCAST, async (ctx) => ctx.scene.enter(constants.SCENE_ID_BROADCAST))
    newsScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))

    return newsScene
}

module.exports = newsSceneGenerate