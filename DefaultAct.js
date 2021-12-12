const constants = require("./model/constants")

function defaultAct(scene, BACK_SCENE_ID) {
    scene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    scene.hears(constants.BUTTON_TEXT_BACK, async (ctx) => ctx.scene.enter(BACK_SCENE_ID))

    scene.hears(new RegExp('меню', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    scene.hears(new RegExp('новости', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_NEWS))
    scene.hears(new RegExp('расписание', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_TIMETABLE))
    scene.hears(new RegExp('кампус|карта|где', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_CAMPUS))
    scene.hears(new RegExp('профиль', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_PROFILE))
    scene.hears(new RegExp('вопрос', 'i'), async (ctx) => ctx.scene.enter(constants.SCENE_ID_FAQ))
}

module.exports = defaultAct