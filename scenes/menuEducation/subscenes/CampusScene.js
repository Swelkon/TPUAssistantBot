const {Scenes: {BaseScene}, Markup} = require('telegraf')
const buildings = require("../../../model/mockdata/buildings")
const constants = require("../../../model/constants")
const defaultAct = require("../../../DefaultAct")

// const CAMPUS_KEYBOARD_MARKUP = Markup.keyboard([[constants.BUTTON_TEXT_CAMPUS_MAP], [constants.BUTTON_TEXT_CAMPUS_LIST], [constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]]).resize(true)
const CAMPUS_KEYBOARD_MARKUP = Markup.keyboard([[constants.BUTTON_TEXT_CAMPUS_MAP], [constants.BUTTON_TEXT_CAMPUS_LIST], [constants.BUTTON_TEXT_MAIN_MENU]]).resize(true)

const CAMPUS_INLINE_KEYBOARD = Markup.inlineKeyboard([
    [Markup.button.callback('ГК', 'btn_mainc'), Markup.button.callback('НТБ', 'btn_library')],
    [Markup.button.callback('Бизнес-инкубатор', 'btn_incubator'), Markup.button.callback('МКЦ', 'btn_culturec')],
    [Markup.button.callback('Профилакторий', 'btn_disp')],
    [Markup.button.callback('Бассейн', 'btn_pool'), Markup.button.callback('ФСЦ', 'btn_gym')],
    [Markup.button.callback('Лыжная база "Политехник"', 'btn_stadium')],
    [Markup.button.callback('Выбрать учебный корпус', 'btn_choice')]
])

const NUM_CAMPUS_KEYBOARD = Markup.inlineKeyboard([
    [Markup.button.callback('№1', 'btn_c1'), Markup.button.callback('№2', 'btn_c2'), Markup.button.callback('№3', 'btn_c3'), Markup.button.callback('№4', 'btn_c4'), Markup.button.callback('№5', 'btn_c5'), Markup.button.callback('№6', 'btn_c6')],
    [Markup.button.callback('№8', 'btn_c8'), Markup.button.callback('№9', 'btn_c9'), Markup.button.callback('№10', 'btn_c10'), Markup.button.callback('№11', 'btn_c11'), Markup.button.callback('№15', 'btn_c15'), Markup.button.callback('№16', 'btn_c16')],
    [Markup.button.callback('№17', 'btn_c17'), Markup.button.callback('№18', 'btn_c18'), Markup.button.callback('№19', 'btn_c19'), Markup.button.callback('№20', 'btn_c20'), Markup.button.callback('№21', 'btn_c21'), Markup.button.callback('КЦ', 'btn_cyberc')],
    [Markup.button.callback('Назад', 'btn_back')]
])

const buildingNames = buildings.map(building => building.name)

// Scene Generator
function campusSceneGenerate() {

    const campusScene = new BaseScene(constants.SCENE_ID_CAMPUS)

    // On enter
    campusScene.enter(async (ctx) => ctx.reply("Просмотр кампуса", CAMPUS_KEYBOARD_MARKUP))

    // listeners
    campusScene.hears(constants.BUTTON_TEXT_CAMPUS_MAP, async (ctx) => {
        await ctx.replyWithHTML("<a href='https://www.google.com/maps/d/u/0/viewer?mid=1aEtl9jI7o0ilkZlAp02dMiw65501vcLA&ll=56.4583366050958%2C84.96033304999997&z=14'>Перейти в GoogleMaps🔗</a>")
    })

    campusScene.hears(constants.BUTTON_TEXT_CAMPUS_LIST, async (ctx) => {
        await ctx.reply('Выбери корпус', CAMPUS_INLINE_KEYBOARD)
    })

    // On callback query
    campusScene.action(buildingNames, async (ctx) => {
        await findLocation(ctx)
    })

    campusScene.action('btn_back', async (ctx) => {
        ctx.answerCbQuery(ctx.callback_query)
        await ctx.editMessageText('Выбери корпус', CAMPUS_INLINE_KEYBOARD)
    })
    campusScene.action('btn_choice', async (ctx) => {
        ctx.answerCbQuery(ctx.callback_query)
        await ctx.editMessageText('Выбери учебный корпус', NUM_CAMPUS_KEYBOARD)
    })

    defaultAct(campusScene, constants.SCENE_ID_EDUCATION)

    return campusScene
}


async function findLocation(ctx) {
    for (let i = 0; i < buildingNames.length; i++) {
        if (ctx.callbackQuery.data === buildingNames[i]) {
            ctx.answerCbQuery(ctx.callback_query)
            await ctx.replyWithLocation(buildings[i].loc_lat, buildings[i].loc_long)
            await ctx.replyWithHTML(buildings[i].address)
        }
    }
}

module.exports = campusSceneGenerate