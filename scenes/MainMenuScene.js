const {Scenes, Markup} = require('telegraf')
const constants = require("../model/constants")
const format = require("string-format")
const DataBus = require("../model/DataBus")
const Api = require("../model/api/Api")
const defaultAct = require("../DefaultAct")

format.extend(String.prototype, {})

// const MAIN_MENU_MARKUP = Markup.keyboard([
//     constants.BUTTON_TEXT_NEWS.format(DataBus.polls.length),
//     constants.BUTTON_TEXT_TIMETABLE,
//     constants.BUTTON_TEXT_EDUCATION,
//     constants.BUTTON_TEXT_PROFILE,
// ]).resize(true)

// клавиатура главного меню с количеством новостей 
function getMainMenuMarkup() {
    if (DataBus.numOfNews === 0) {
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


// генерация сцены главного меню
function mainMenuSceneGenerate() {
    const mainMenuScene = new Scenes.BaseScene(constants.SCENE_ID_MAIN_MENU)

    // вход в сцену
    mainMenuScene.enter(async (ctx) => {

        // вывод клавиатуры
        await ctx.reply(constants.TEXT_MAIN_MENU, {
            reply_markup: getMainMenuMarkup().reply_markup
        })

        // сбор информации о пользователе
        const user = DataBus.getUser({ctx})
        DataBus.retrievePosts()
        DataBus.retrieveUserTimetable({
                ctx: ctx,
                chat_id: user.chat_id,
                telegram_token: user.telegram_token
            }
        )
    })

    // добавление переходов в сцены при нажатии на соответствующие кнопки
    // mainMenuScene.hears(constants.BUTTON_TEXT_NEWS, async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    mainMenuScene.hears(new RegExp('Новости'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    mainMenuScene.hears(constants.BUTTON_TEXT_TIMETABLE, async (ctx) => ctx.scene.enter(constants.SCENE_ID_TIMETABLE))
    // mainMenuScene.hears(constants.BUTTON_TEXT_EDUCATION, async (ctx) => ctx.scene.enter(constants.SCENE_ID_EDUCATION))
    mainMenuScene.hears(constants.BUTTON_TEXT_CAMPUS, async (ctx) => ctx.scene.enter(constants.SCENE_ID_CAMPUS))
    mainMenuScene.hears(constants.BUTTON_TEXT_PROFILE, async (ctx) => ctx.scene.enter(constants.SCENE_ID_PROFILE))
    // mainMenuScene.on("message", async (ctx) => ctx.reply("Выберите пункт из меню"))

    // функция с методами для всех сцен, передается сама сцена и сцена для возвращения назад
    defaultAct(mainMenuScene, constants.SCENE_ID_MAIN_MENU)
    return mainMenuScene
}

module.exports = mainMenuSceneGenerate