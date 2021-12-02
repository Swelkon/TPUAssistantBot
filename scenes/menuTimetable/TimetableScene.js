const {Scenes, Markup} = require('telegraf')
const constants = require("../../model/constants")
const Lesson = require("../../model/data/Lesson")
const DataBus = require("../../model/DataBus")
const Api = require("../../model/api/Api")
const buildings = require("../../model/mockdata/buildings")

let lessons = []

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

const weekdays = ['воскресенье', 'понедельник', 'вторник',
    'среду', 'четверг', 'пятницу', 'субботу']
const weekdays_btn = ['0', 'btn_monday', 'btn_tuesday',
    'btn_wednesday', 'btn_thursday', 'btn_friday', 'btn_saturday']
const lessonsTime = {
    // '08:30 – 18:05': '#️⃣',
    '08:30 – 10:05': '1️⃣',
    '10:25 – 12:00': '2️⃣',
    '12:40 – 14:15': '3️⃣',
    '14:35 – 16:10': '4️⃣',
    '16:30 – 18:05': '5️⃣',
    '18:25 – 20:00': '6️⃣',
    '20:20 – 21:55': '7️⃣'
}

let date = new Date() // date example
let numDate = date.getDay()
let retrievedLessons = null

function timetableSceneGenerate() {
    const timetableScene = new Scenes.BaseScene(constants.SCENE_ID_TIMETABLE)

    timetableScene.enter(async (ctx) => {
        date = new Date() // date example
        numDate = date.getDay()

        switch (await DataBus.retrieveUserTimetable({
            ctx: ctx,
            chat_id: ctx.chat.id,
            telegram_token: ctx.session.user.telegram_token
        })) {
            case Api.STATUS_OK:
                lessons = []
                retrievedLessons = DataBus.getUserTimetable({ctx: ctx})
                if (retrievedLessons && retrievedLessons.length !== 0) {
                    for (let i = 0; i < retrievedLessons.length; i++) {
                        let l = retrievedLessons[i]
                        lessons.push(new Lesson(l.id, l.start, l.end, l.tip, l.place, l.event, l.disciplina, l.lichnost))
                    }
                    await ctx.reply('Раздел "Расписание"', TIMETABLE_MARKUP)
                    await sendTimetable(numDate, ctx)
                } else {
                    await ctx.reply('Извините, не смог найти информацию о вашем расписании')
                    ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
                }
                break
            default:
                await ctx.reply("Мне нужно обновить данные. Пожалуйста, авторизируйтесь еще раз через почту ТПУ")
                await ctx.scene.enter(constants.SCENE_ID_START)
                break

        }

    })

    timetableScene.hears(constants.BUTTON_TEXT_TT_TODAY, async (ctx) => sendTimetable(numDate, ctx))
    timetableScene.hears(constants.BUTTON_TEXT_TT_TOMORROW, async (ctx) => sendTimetable((numDate + 1) % 7, ctx))
    timetableScene.hears(constants.BUTTON_TEXT_TT_DAY, async (ctx) => ctx.reply('Расписание на неделю', WEEKDAYS_MARKUP))
    timetableScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))
    timetableScene.hears(new RegExp('/where'), async (ctx) => {
        const lesson = lessons.find((l, i, arr) => l.where === ctx.message.text)
        console.log("Found lesson: ", lesson)
        if (!lesson) {
            await ctx.reply("Не могу найти какой это урок")
            return
        }
        const building = buildings.find((b, i, arr) => b.short_name === lesson.place.korpus)
        console.log("Found building: ", building)

        if (!building) {
            await ctx.reply("Не смог найти это здание")
            return
        }
        await ctx.replyWithHTML(building.address)
        await ctx.replyWithLocation(building.loc_lat, building.loc_long)

    })

    timetableScene.on("message", async (ctx) => ctx.reply("Выберите пункт из меню"))

    timetableScene.action(weekdays_btn, async (ctx) => {
        ctx.answerCbQuery()
        await sendTimetable(weekdays_btn.indexOf(ctx.callbackQuery.data), ctx)
    })

    return timetableScene
}

async function sendTimetable(day, ctx) {
    let str = `<b>Расписание на ${weekdays[day]}:</b>\n\n`
    for (let time in lessonsTime) {
        str += `${lessonsTime[time]} ${time}\n`
        for (let i = 0; i < lessons.length; i++) {
            let l = lessons[i]
            // if (l.date.getDay() === day && `${l.start} – ${l.end}` === `${time}`) {
            if (l.date.getDay() === day && parseInt(l.start.substr(0, 2), 10) <= parseInt(time.substr(0, 2), 10) && parseInt(l.end.substr(0, 2), 10) >= parseInt(time.substr(8, 2), 10) - 1) {
                str += `\n🔸 <i>${l.disciplina?.full_name}</i>\n`
                for (let j = 0; j < l.lichnost.length; j++) {
                    if (l.lichnost?.[j]) str += `${l.lichnost?.[j]?.title}\n`
                }
                str += `${l.tip}\n`
                if (l?.place) str += `к. ${l.place?.korpus}, ауд. ${l.place?.nomer}\n`
                if (l?.place) str += `Где это? ${l.where}\n`
            }
        }
        str += `\n`
    }
    await ctx.replyWithHTML(str)
}

module.exports = timetableSceneGenerate


