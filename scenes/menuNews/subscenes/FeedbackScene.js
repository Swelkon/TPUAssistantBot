const {Scenes: {WizardScene}, Markup} = require('telegraf')
const constants = require("../../../model/constants")
const DataBus = require("../../../model/DataBus");

// клавиатура подтверждения действия
const CHOICE_KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback('Да', 'btn_yes'), Markup.button.callback('Нет', 'btn_no')
])

// клавиатура выхода из сцены
const FEEDBACK_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_BACK,
    constants.BUTTON_TEXT_MAIN_MENU
]).resize(true)

let msg // отправляемое сообщение
const developers = constants.DEVELOPERS_GROUP // chat_id разработчиков
// const developers = [452118266, 819382563] // chat_id разработчиков

// сцена для обратной связи
function feedbackSceneGenerate() {
    return new WizardScene(
        constants.SCENE_ID_FEEDBACK,
        // 1 шаг - запрос сообщения
        async (ctx) => {
            await ctx.reply('Наберите текст сообщения, которое хотите оставить разработчикам', FEEDBACK_MARKUP)
            return ctx.wizard.next()
        },
        // 2 шаг - подтверждение действия
        async (ctx) => {
            if (ctx.message.text === constants.BUTTON_TEXT_BACK) ctx.scene.enter(constants.SCENE_ID_NEWS)
            if (ctx.message.text === constants.BUTTON_TEXT_MAIN_MENU) ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
            else {
                msg = ctx.message.text
                await ctx.reply('Отправить сообщение?', CHOICE_KEYBOARD)
                return ctx.wizard.next()
            }
        },
        // 3 шаг - отправка сообщения
        async (ctx) => {
            switch (ctx.callbackQuery?.data) {
                case 'btn_yes':
                    ctx.answerCbQuery()
                    await sendMsg(msg, ctx)
                    await ctx.editMessageText('Сообщение отправлено')
                    break
                case 'btn_no':
                    ctx.answerCbQuery()
                    await ctx.editMessageText('Отправка отменена')
                    break
                default:
                    await ctx.reply("Выберите действие!")
                    return ctx.wizard.selectStep(2)
            }
            return ctx.scene.enter(constants.SCENE_ID_NEWS)
        },
    )
}

// приостановка выполнения функции
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// отправка сообщения разработчикам
async function sendMsg(msg, ctx) {
    for (let i in developers) {
        const user = DataBus.getUser({ctx: ctx})
        let feedback_message = `Feedback от @${ctx.callbackQuery.from.username}\n`
        feedback_message += `Имя пользователя: ${user.first_name} ${user.last_name}\n`
        feedback_message += `Email: ${user.email}\n`
        feedback_message += `Feedback: «${msg}»\n`
        await ctx.telegram.sendMessage(developers[i], feedback_message)
        await sleep(35)
    }
}

module.exports = feedbackSceneGenerate