const {Scenes, Markup} = require('telegraf')
const constants = require("../../model/constants")
const Lesson = require("../../model/data/Lesson")
const DataBus = require("../../model/DataBus")
const Api = require("../../model/api/Api")
const buildings = require("../../model/mockdata/buildings")
const defaultAct = require("../../DefaultAct")

// let lessons = []

// клавиатура для расписания: расписание на сегодня / завтра / день и главное меню
const TIMETABLE_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_TT_TODAY,
    constants.BUTTON_TEXT_TT_TOMORROW,
    constants.BUTTON_TEXT_TT_DAY,
    constants.BUTTON_TEXT_MAIN_MENU
]).resize(true)

// клавиатура для выбора дня текущей недели при выборе расписания на день
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

let retrievedLessons = null

// генерация сцены расписания
function timetableSceneGenerate() {
    const timetableScene = new Scenes.BaseScene(constants.SCENE_ID_TIMETABLE)

    // вход в сцену
    timetableScene.enter(async (ctx) => {

        if (!DataBus.getUser({ctx: ctx})) {
            await ctx.reply('Кажется кто-то не авторизован)')
            await ctx.scene.enter(constants.SCENE_ID_START)
        }
        
        // lessons = []
        // получение расписания пользователя на текущую неделю
        retrievedLessons = DataBus.getUserTimetable({ctx: ctx})
        // retrievedLessons = []
        if (retrievedLessons && retrievedLessons.length !== 0) {
            // for (let i = 0; i < retrievedLessons.length; i++) {
            //     let l = retrievedLessons[i]
            //     lessons.push(new Lesson(l.id, l.start, l.end, l.tip, l.place, l.event, l.disciplina, l.lichnost))
            // }
            await ctx.reply('Раздел "Расписание"', TIMETABLE_MARKUP)
            // отправка расписания на сегодняшний день
            await sendTimetable(getNumDate(), ctx)
        } else {
            await ctx.reply('Минуту, сейчас достану ваше расписание) ...')

            // switch (await DataBus.retrieveUserTimetable({
            //     ctx: ctx,
            //     chat_id: ctx.chat.id,
            //     telegram_token: DataBus.getUser({ctx: ctx}).telegram_token
            // })) {
            //     case Api.STATUS_OK:
            //         ctx.scene.reenter()
            //         break
            //     default:
            //         await ctx.reply("Мне нужно обновить данные. Пожалуйста, авторизируйтесь еще раз через почту ТПУ")
            //         await ctx.scene.enter(constants.SCENE_ID_START)
            //         break
            // }
        }

        // запрос на получение расписания пользователя через api
        DataBus.retrieveUserTimetable({
            ctx: ctx,
            chat_id: ctx.chat.id,
            telegram_token: DataBus.getUser({ctx: ctx}).telegram_token
        }).then((status) => {
            // если успешно, но расписание еще не выведено, то повторный вход в сцену
                if (status === Api.STATUS_OK) {
                    if (!retrievedLessons || retrievedLessons.length === 0) {
                        ctx.scene.reenter()
                    }
                } else {
                    // иначе предложение пройти авторизацию
                    ctx.reply("Мне нужно обновить данные о пользователе. Пожалуйста, авторизируйтесь еще раз")
                    ctx.scene.enter(constants.SCENE_ID_START)
                }
            }
        )


    })

    // добавление вывода расписания при нажатии на соответствующие кнопки
    timetableScene.hears(constants.BUTTON_TEXT_TT_TODAY, async (ctx) => { await sendTimetable(getNumDate(), ctx)})
    timetableScene.hears(constants.BUTTON_TEXT_TT_TOMORROW, async (ctx) => sendTimetable((getNumDate() + 1) % 7, ctx))
    
    // вывод клавиатуры для выбора дня недели
    timetableScene.hears(constants.BUTTON_TEXT_TT_DAY, async (ctx) => ctx.reply('Расписание на неделю', WEEKDAYS_MARKUP))
    
    // вывод локации корпуса, в котором проходит пара, при нажатии на ссылку
    timetableScene.hears(new RegExp('/where'), async (ctx) => {
        const lessons = DataBus.getUserTimetable({ctx})
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

    // вывод расписния на определенный день недели
    timetableScene.action(weekdays_btn, async (ctx) => {
        ctx.answerCbQuery()
        await sendTimetable(weekdays_btn.indexOf(ctx.callbackQuery.data), ctx)
    })

    // функция с методами для всех сцен, передается сама сцена и сцена для возвращения назад
    defaultAct(timetableScene, constants.SCENE_ID_MAIN_MENU)
    // timetableScene.on("message", async (ctx) => ctx.reply("Выберите пункт из меню"))
    return timetableScene
}

// функция для получения текущей даты
function getNumDate() {
    const date = new Date()
    const numDate = date.getDay()
    return numDate
}

// функция формирования сообщения с расписанием
async function sendTimetable(day, ctx) {
    // получение расписания
    const lessons = DataBus.getUserTimetable({ctx})
    let str = `<b>Расписание на ${weekdays[day]}:</b>\n\n`
    // цикл для обработки пар на день
    for (let time in lessonsTime) {
        // добавление времени пары
        str += `${lessonsTime[time]} ${time}\n`
        for (let i = 0; i < lessons.length; i++) {
            let l = lessons[i]
            // if (l.date.getDay() === day && `${l.start} – ${l.end}` === `${time}`) {
            // проверка пар для поиска подходящей по дню и времени 
            if (l.date.getDay() === day && parseInt(l.start.substr(0, 2), 10) <= parseInt(time.substr(0, 2), 10) && parseInt(l.end.substr(0, 2), 10) >= parseInt(time.substr(8, 2), 10) - 1) {
                // добавление названия пары
                str += `\n🔸 <i>${l.disciplina?.full_name}</i>\n`
                for (let j = 0; j < l.lichnost.length; j++) {
                    // добавление преподавателя
                    if (l.lichnost?.[j]) str += `${l.lichnost?.[j]?.title}\n`
                }
                // добавление типа пары и очного места проведения
                if (l?.tip) str += `${l.tip}\n`
                if (l?.place) str += `к. ${l.place?.korpus}, ауд. ${l.place?.nomer}\n`
                if (l?.place) str += `Где это? ${l.where}\n`
            }
        }
        str += `\n`
    }
    await ctx.replyWithHTML(str)
}

module.exports = timetableSceneGenerate


