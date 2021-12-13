const constants = require("./model/constants")
const DataBus = require("./model/DataBus");
const Api = require("./model/api/Api");

function defaultAct(scene, BACK_SCENE_ID) {
    scene.hears("/start", async (ctx) => ctx.scene.enter(constants.SCENE_ID_START))
    scene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    scene.hears(constants.BUTTON_TEXT_BACK, async (ctx) => ctx.scene.enter(BACK_SCENE_ID))

    scene.hears(new RegExp('меню', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    scene.hears(new RegExp('новости|нового', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    scene.hears(new RegExp('расписание|занятия|уроки|сегодня', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_TIMETABLE))
    scene.hears(new RegExp('кампус|карта|где', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_CAMPUS))
    scene.hears(new RegExp('профиль', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_PROFILE))
    scene.hears(new RegExp('вопрос', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_FAQ))

    scene.on('text', async (ctx) => {
        const FAQResponse = await DataBus.getFAQAnswer(ctx.message.text)
        const answer = FAQResponse.data

        if (FAQResponse.statusCode === Api.STATUS_SERVER_ERROR || answer === 'No good match found in KB.') {
            ctx.reply('Извини, я такое не знаю :(')
        } else
            ctx.reply(answer)

    })
}

module.exports = defaultAct