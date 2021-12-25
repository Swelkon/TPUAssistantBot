const {Scenes, Markup} = require('telegraf')
const constants = require("../../model/constants")
const format = require("string-format")
const DataBus = require("../../model/DataBus")
const defaultAct = require("../../DefaultAct")

format.extend(String.prototype, {})

// const NEWS_MARKUP = Markup.keyboard([
//     constants.BUTTON_TEXT_POLLS.format(DataBus.polls.length),
//     constants.BUTTON_TEXT_BROADCAST,
//     constants.BUTTON_TEXT_ASK_QUESTION,
//     constants.BUTTON_TEXT_MAIN_MENU
// ]).resize()

// клавиатура раздела новостей 
function getNewsMarkup() {
    return Markup.keyboard([
        constants.BUTTON_TEXT_POSTS.format(DataBus.posts.length),
        constants.BUTTON_TEXT_POLLS.format(DataBus.polls.length),
        constants.BUTTON_TEXT_VACANCIES.format(DataBus.vacancies.length),
        constants.BUTTON_TEXT_FAQ,
        constants.BUTTON_TEXT_FEEDBACK,
        // constants.BUTTON_TEXT_ASK_QUESTION,
        constants.BUTTON_TEXT_MAIN_MENU
    ]).resize()
}

// генерация сцены новостей
function newsSceneGenerate() {
    const newsScene = new Scenes.BaseScene(constants.SCENE_ID_NEWS)

    // вход в сцену
    newsScene.enter(async (ctx) => await ctx.reply('Раздел "Новости"', getNewsMarkup()))

    // добавление переходов в сцены при нажатии на соответствующие кнопки
    newsScene.hears(new RegExp('^Посты'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_POSTS))
    newsScene.hears(new RegExp('^Голосования'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_POLLS))
    newsScene.hears(new RegExp('^Вакансии'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_VACANCY))
    newsScene.hears(constants.BUTTON_TEXT_FEEDBACK, async (ctx) => ctx.scene.enter(constants.SCENE_ID_FEEDBACK))
    // newsScene.hears(constants.BUTTON_TEXT_ASK_QUESTION, async (ctx) => ctx.scene.enter(constants.SCENE_ID_ASK_QUESTION))
    newsScene.hears(constants.BUTTON_TEXT_FAQ, async (ctx) => ctx.scene.enter(constants.SCENE_ID_FAQ))

    // функция с методами для всех сцен, передается сама сцена и сцена для возвращения назад
    defaultAct(newsScene, constants.SCENE_ID_MAIN_MENU)
    return newsScene
}

module.exports = newsSceneGenerate