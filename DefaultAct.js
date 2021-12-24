const constants = require("./model/constants")
const DataBus = require("./model/DataBus");
const Api = require("./model/api/Api");

// функция defaultAct() содержит стандартные методы для всех сцен
function defaultAct(scene, BACK_SCENE_ID) {

    // блок hears для навигации на сцены: старт / главное меню / назад
    scene.hears(constants.BUTTON_TEXT_START, async (ctx) => ctx.scene.enter(constants.SCENE_ID_START))
    scene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    scene.hears(constants.BUTTON_TEXT_BACK, async (ctx) => ctx.scene.enter(BACK_SCENE_ID))

    // блок hears для навигации по сценом с помощью ключевых сообщений
    scene.hears(new RegExp('меню', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    scene.hears(new RegExp('новости|нового', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    scene.hears(new RegExp('расписание|занятия|уроки|сегодня', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_TIMETABLE))
    scene.hears(new RegExp('кампус|карта|где', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_CAMPUS))
    scene.hears(new RegExp('профиль', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_PROFILE))
    scene.hears(new RegExp('вопрос', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_FAQ))

    // реализация ответа на вопрос от пользователя
    scene.on('text', async (ctx) => {
        const {status, answer} = await DataBus.getFAQAnswer(ctx.message.text)

        if (status !== Api.STATUS_OK || answer === 'No good match found in KB.') {
            ctx.reply('Извини, я такое не знаю :(')
        } else
            ctx.reply(answer)

    })
}

module.exports = defaultAct