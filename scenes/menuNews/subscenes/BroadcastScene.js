const {Scenes: {WizardScene}, Markup} = require('telegraf')
const constants = require("../../../model/constants")

const CHOICE_KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback('Да', 'btn_yes'), Markup.button.callback('Нет', 'btn_no')
])

const BROADCAST_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_BACK,
    constants.BUTTON_TEXT_MAIN_MENU
]).resize(true)

let msg
const users = [-612095035, -699676297]

function broadcastSceneGenerate() {
    return new WizardScene(
        constants.SCENE_ID_BROADCAST,
        async (ctx) => {
            await ctx.reply('Наберите текст сообщения', BROADCAST_MARKUP)
            return ctx.wizard.next()
        },
        async (ctx) => {
            if (ctx.message.text === constants.BUTTON_TEXT_BACK) ctx.scene.enter(constants.SCENE_ID_NEWS)
            if (ctx.message.text === constants.BUTTON_TEXT_MAIN_MENU) ctx.scene.enter(constants.SCENE_ID_MAIN_MENU)
            else {
                msg = ctx.message.text
                await ctx.reply('Разослать сообщение?', CHOICE_KEYBOARD)
                return ctx.wizard.next()
            }
        },
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function sendMsg(msg, ctx) {
    for (let i in users) {
        await ctx.telegram.sendMessage(users[i], msg)
        await sleep(35)
    }
}

module.exports = broadcastSceneGenerate