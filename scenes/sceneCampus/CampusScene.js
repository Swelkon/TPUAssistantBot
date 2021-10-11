const {Scenes: {BaseScene}, Markup} = require('telegraf')
const buildings = require("./buildings")
const {SCENE_IDS} = require("../../constants")

const campus_keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('ГК', 'btn_mainc'), Markup.button.callback('НТБ', 'btn_library')],
    [Markup.button.callback('Бизнес-инкубатор', 'btn_incubator'), Markup.button.callback('МКЦ', 'btn_culturec')],
    [Markup.button.callback('Профилакторий', 'btn_disp')],
    [Markup.button.callback('Бассейн', 'btn_pool'), Markup.button.callback('ФСЦ', 'btn_gym')],
    [Markup.button.callback('Лыжная база "Политехник"', 'btn_stadium')],
    [Markup.button.callback('Выбрать учебный корпус', 'btn_choice')]
])

const numCampus_keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('№1', 'btn_c1'), Markup.button.callback('№2', 'btn_c2'), Markup.button.callback('№3', 'btn_c3'), Markup.button.callback('№4', 'btn_c4'), Markup.button.callback('№5', 'btn_c5'), Markup.button.callback('№6', 'btn_c6')],
    [Markup.button.callback('№8', 'btn_c8'), Markup.button.callback('№9', 'btn_c9'), Markup.button.callback('№10', 'btn_c10'), Markup.button.callback('№11', 'btn_c11'), Markup.button.callback('№15', 'btn_c15'), Markup.button.callback('№16', 'btn_c16')],
    [Markup.button.callback('№17', 'btn_c17'), Markup.button.callback('№18', 'btn_c18'), Markup.button.callback('№19', 'btn_c19'), Markup.button.callback('№20', 'btn_c20'), Markup.button.callback('№21', 'btn_c21'), Markup.button.callback('КЦ', 'btn_cyberc')],
    [Markup.button.callback('Назад', 'btn_back')]
])

const buildingNames = buildings.map(building => building.name)

function campusSceneGenerate() {

    const campusScene = new BaseScene(SCENE_IDS.CAMPUS)
    campusScene.enter(async (ctx) => await ctx.reply('Выбери корпус', campus_keyboard))
    campusScene.action(buildingNames, async (ctx) => {
        await findLocation(ctx)
    })

    async function findLocation(context) {
        for (let i = 0; i < buildingNames.length; i++) {
            if (context.callbackQuery?.data === buildingNames[i]) {
                await context.telegram.sendLocation(context.chat.id, buildings[i].loc_lat, buildings[i].loc_long)
                await context.replyWithHTML(buildings[i].address)
            }
        }
    }

    campusScene.action('btn_back', async (ctx) => {
        await ctx.editMessageText('Выбери корпус', campus_keyboard)
    })
    campusScene.action('btn_choice', async (ctx) => {
        await ctx.editMessageText('Выбери учебный корпус', numCampus_keyboard)
    })

    return campusScene
}

module.exports = campusSceneGenerate