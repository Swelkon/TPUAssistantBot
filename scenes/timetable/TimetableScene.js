const { Scenes, Markup } = require('telegraf')
const constants = require("../../constants")
const Api = require("../../model/api/Api")

const TIMETABLE_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_TT_TODAY,
    constants.BUTTON_TEXT_TT_TOMORROW,
    constants.BUTTON_TEXT_TT_DAY,
    constants.BUTTON_TEXT_MAIN_MENU
]).resize(true)

const WEEKDAYS_MARKUP = Markup.inlineKeyboard([
    Markup.button.callback('Пн', 'btn_monday'),
    Markup.button.callback('Вт', 'btn_tuesday'),
    Markup.button.callback('Ср', 'btn_wednesday'),
    Markup.button.callback('Чт', 'btn_thursday'),
    Markup.button.callback('Пт', 'btn_friday'),
    Markup.button.callback('Сб', 'btn_saturday')
])

var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
var date = new Date()
var numDate = date.getDay()

function timetableSceneGenerate() {
    const  timetableScene = new Scenes.BaseScene(constants.SCENE_ID_TIMETABLE)

    timetableScene.enter( async (ctx) => {
        await ctx.reply('Раздел "Расписание"', TIMETABLE_MARKUP)
    })

    timetableScene.hears(constants.BUTTON_TEXT_TT_TODAY, async (ctx) => sendTimetable(weekdays[numDate]))
    timetableScene.hears(constants.BUTTON_TEXT_TT_TOMORROW, async (ctx) => sendTimetable(weekdays[(numDate + 1) % 7]))
    timetableScene.hears(constants.BUTTON_TEXT_TT_DAY, async (ctx) => ctx.reply('Расписание на неделю', WEEKDAYS_MARKUP))
    timetableScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    timetableScene.on("message", async (ctx) => ctx.reply("Выберите пункт из меню"))

    timetableScene.action('btn_monday', async (ctx) => sendTimetable(weekdays[1]))
    timetableScene.action('btn_tuesday', async (ctx) => sendTimetable(weekdays[2]))
    timetableScene.action('btn_wednesday', async (ctx) => sendTimetable(weekdays[3]))
    timetableScene.action('btn_thursday', async (ctx) => sendTimetable(weekdays[4]))
    timetableScene.action('btn_friday', async (ctx) => sendTimetable(weekdays[5]))
    timetableScene.action('btn_saturday', async (ctx) => sendTimetable(weekdays[6]))

    return  timetableScene
}

function sendTimetable(weekday) {
    // start.slice(11, 16) 
    // end.slice(11, 16)
}

module.exports = timetableSceneGenerate