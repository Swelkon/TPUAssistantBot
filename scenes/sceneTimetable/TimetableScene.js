const { Scenes, Markup } = require('telegraf')
const constants = require("../../constants")
const Lesson = require("./Lesson")

// example of the response from the server
const response = [
    {
        "start": "2021-11-08 08:30:00",
        "end": "2021-11-08 10:05:00",
        "weekday": "Monday",
        "tip": "Лабораторная работа",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Тестирование программного обеспечения"
        },
        "lichnost": [
            {
                "title": "Копнов М. В."
            }
        ]
    },
    {
        "start": "2021-11-10 08:30:00",
        "end": "2021-11-10 18:05:00",
        "weekday": "Wednesday",
        "tip": "Практика",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Военная подготовка"
        },
        "lichnost": []
    },
    {
        "start": "2021-11-11 12:40:00",
        "end": "2021-11-11 14:15:00",
        "weekday": "Thursday",
        "tip": "Лабораторная работа",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Разработка приложений для мобильных устройств"
        },
        "lichnost": [
            {
                "title": "Дорофеев В. А."
            }
        ]
    },
    {
        "start": "2021-11-11 12:40:00",
        "end": "2021-11-11 14:15:00",
        "tip": "Лекция",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Компьютерная графика, виртуальная и дополненная реальность"
        },
        "lichnost": [
            {
                "title": "Демин А. Ю."
            }
        ]
    },
    {
        "start": "2021-11-12 16:30:00",
        "end": "2021-11-12 18:05:00",
        "tip": "Лабораторная работа",
        "weekday": "Friday",
        "place": {
            "nomer": "403Б",
            "korpus": "10"
        },
        "event": null,
        "disciplina": {
            "full_name": "Методы машинного обучения"
        },
        "lichnost": [
            {
                "title": "Друки А. А."
            }
        ]
    }
]

let lessons = []
for (let i = 0; i < response.length; i++) {
    let l = response[i]
    lessons.push(new Lesson(l.start, l.end, l.tip, l.place, l.event, l.disciplina, l.lichnost))
}

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
    'btn_wednesday', 'btn_thursday', 'btn_friday','btn_saturday']
const lessonsTime = {
    '08:30 – 18:05': '#️⃣',
    '08:30 – 10:05': '1️⃣',
    '10:25 – 12:00': '2️⃣',
    '12:40 – 14:15': '3️⃣',
    '14:35 – 16:10': '4️⃣',
    '16:30 – 18:05': '5️⃣',
    '18:25 – 20:00': '6️⃣',
    '20:20 – 21:55': '7️⃣'
}

let date = new Date('2021-11-08T08:30:00') // date example
let numDate = date.getDay()

function timetableSceneGenerate() {
    const  timetableScene = new Scenes.BaseScene(constants.SCENE_ID_TIMETABLE)

    timetableScene.enter( async (ctx) => {
        await ctx.reply('Раздел "Расписание"', TIMETABLE_MARKUP)
    })

    timetableScene.hears(constants.BUTTON_TEXT_TT_TODAY, async (ctx) => sendTimetable(numDate, ctx))
    timetableScene.hears(constants.BUTTON_TEXT_TT_TOMORROW, async (ctx) => sendTimetable((numDate + 1) % 7, ctx))
    timetableScene.hears(constants.BUTTON_TEXT_TT_DAY, async (ctx) => ctx.reply('Расписание на неделю', WEEKDAYS_MARKUP))
    timetableScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))

    timetableScene.on("message", async (ctx) => ctx.reply("Выберите пункт из меню"))

    timetableScene.action(weekdays_btn, async (ctx) => {
        ctx.answerCbQuery()
        await sendTimetable(weekdays_btn.indexOf(ctx.callbackQuery.data), ctx)
    })

    return  timetableScene
}

async function sendTimetable(day, ctx) {
    let str = `<b>Расписание на ${weekdays[day]}:</b>\n\n`
    for (let time in lessonsTime) {
        str += `${lessonsTime[time]} ${time}\n`
        for (let i = 0; i < lessons.length; i++) {
            let l = lessons[i]
            if (l.date.getDay() === day && `${l.start} – ${l.end}` === `${time}`) {
                str += `— <i>${l.disciplina?.full_name}</i>\n`
                for (let j = 0; j < l.lichnost.length; j++) {
                    if (l.lichnost?.[j]) str += `${l.lichnost?.[j]?.title}\n`
                }
                str += `${l.tip}\n`
                if (l?.place) str += `к. ${l.place?.korpus}, ауд. ${l.place?.nomer}\n`
            }
        }
        str += `\n`
    }
    await ctx.replyWithHTML(str)
}

module.exports = timetableSceneGenerate