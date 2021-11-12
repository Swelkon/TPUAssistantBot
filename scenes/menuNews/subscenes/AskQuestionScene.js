const {Scenes: {WizardScene, Stage}, Composer, Markup} = require('telegraf')
const constants = require("../../../constants")

const RECIPIENT_MARKUP = Markup.keyboard([
    [constants.BUTTON_TEXT_DEAN],
    [constants.BUTTON_TEXT_STUDENT_COUNCIL],
    [constants.BUTTON_TEXT_STUDENTS],
    [constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]
]).resize(true)

const QUESTION_MARKUP = Markup.keyboard([
    ["Изменить адресата"],
    [constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]
]).resize(true)
const RETURN_BACK_MARKUP = Markup.keyboard([
    [constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]
]).resize(true)

const SUBMIT_MARKUP = Markup.inlineKeyboard([
    [Markup.button.callback("Отправить", "btn_submit"), Markup.button.callback("Отмена", "btn_cancel")]
]).resize(true)


const DEAN_OFFICE = -603452093
const STUDENT_UNION = -795223750

function askQuestionSceneGenerate() {
    // handlers
    const enterHandler = new Composer()
    enterHandler.on('text', async (ctx) => {
        await ctx.reply('Кому вы хотите задать вопрос?', RECIPIENT_MARKUP)
        return ctx.wizard.next()
    })

    const addresseeHandler = new Composer()
    addresseeHandler.on('text', async (ctx) => {

        if (ctx.message.text === constants.BUTTON_TEXT_DEAN ||
            ctx.message.text === constants.BUTTON_TEXT_STUDENT_COUNCIL ||
            ctx.message.text === constants.BUTTON_TEXT_STUDENTS) {
            ctx.scene.state.addressee = ctx.message.text
            ctx.reply('Напишите текст вопроса', QUESTION_MARKUP)
            return ctx.wizard.next()
        } else {
            ctx.reply('Я вас не понял, нажмите на кнопку под клавиатурой')
        }
    })

    const questionTextHandler = new Composer()
    questionTextHandler.on('text', async (ctx) => {
        ctx.scene.state.questionText = ctx.message.text
        ctx.reply('Подтвердите отправку', RETURN_BACK_MARKUP)
        ctx.reply(`Адресат: ${ctx.scene.state.addressee}\nВопрос: ${ctx.scene.state.questionText}`, SUBMIT_MARKUP)
        return ctx.wizard.next()
    })

    const confirmMessageHandler = new Composer()
    confirmMessageHandler.on('callback_query', async (ctx) => {
        switch (ctx.callbackQuery?.data) {
            case 'btn_submit':
                const recipientId = ctx.scene.state.addressee === constants.BUTTON_TEXT_DEAN ? DEAN_OFFICE : STUDENT_UNION
                const username = ctx.callbackQuery.from.username
                await ctx.telegram.sendMessage(recipientId, `Вам вопрос от @${username}:\n${ctx.scene.state.questionText}`)
                ctx.reply('Письмо отправлено, ожидайте ответ')
                return ctx.scene.enter(constants.SCENE_ID_NEWS)
                break
            case 'btn_cancel':
                ctx.reply('Ладно, так уж и быть, не отправлю)')
                return ctx.scene.enter(constants.SCENE_ID_NEWS)
                break
            default:
                ctx.reply('Я вас не понял, нажмите на кнопку под сообщением')
                break
        }
        // if (ctx.message.text === 'Отправить') {
        //     // тут типа отправка сообщения наверное
        //     ctx.reply('Письмо отправлено, ожидайте ответ')
        // } else {
        //     ctx.reply('Я вас не понял, нажмите на кнопку под клавиатурой')
        // }
    })

    const askQuestionScene = new WizardScene(
        constants.SCENE_ID_ASK_QUESTION,
        enterHandler,
        addresseeHandler,
        questionTextHandler,
        confirmMessageHandler
    )
    // const stage = new Stage([askQuestionScene])
    //
    // stage.hears(constants.BUTTON_TEXT_BACK, ctx => ctx.scene.enter(constants.SCENE_ID_NEWS))
    // stage.hears(constants.BUTTON_TEXT_MAIN_MENU, ctx => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))

    return askQuestionScene
}

module.exports = askQuestionSceneGenerate