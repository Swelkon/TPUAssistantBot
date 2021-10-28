const { Scenes: {WizardScene, Stage}, Composer, Markup} = require('telegraf')
const constants = require("../../constants")

const ADDRESSEES_MARKUP = [
    constants.BUTTON_TEXT_DEAN,
    constants.BUTTON_TEXT_STUDENT_COUNCIL,
    constants.BUTTON_TEXT_STUDENTS
]
const RETURN_BACK_MARKUP = ['Предыдущий раздел', 'Главное меню']

function askQuestionSceneGenerate() {
    // handlers
    const enterHandler = new Composer()
    enterHandler.on('text', async (ctx) => {
        await ctx.reply('Кому вы хотите задать вопрос?', Markup.keyboard(ADDRESSEES_MARKUP, RETURN_BACK_MARKUP))
        return ctx.wizard.next()
    })

    const addresseeHandler = new Composer()
    addresseeHandler.on('text', async(ctx) => {
        if(ctx.message.text === constants.BUTTON_TEXT_DEAN ||
            ctx.message.text === constants.BUTTON_TEXT_STUDENT_COUNCIL ||
            ctx.message.text === constants.BUTTON_TEXT_STUDENTS)
        {
            ctx.state.addressee = ctx.message.text
            ctx.reply('Напишите текст вопроса', Markup.keyboard(['Изменить адресата'], RETURN_BACK_MARKUP))
            return ctx.wizard.next()
        }
        else{
            ctx.reply('Я вас не понял, нажмите на кнопку под клавиатурой')
        }
    })

    const questionTextHandler = new Composer()
    questionTextHandler.on('text', async(ctx) => {
        ctx.state.questionText = ctx.message.text
        ctx.reply('Подтвердите отправку', Markup.keyboard(['Отправить'], RETURN_BACK_MARKUP))
        ctx.reply(`Адресат: ${ctx.state.addressee}\n\nВопрос:\n\n${ctx.state.questionText}`)
        return ctx.wizard.next()
    })

    const confirmMessageHandler = new Composer()
    confirmMessageHandler.on('text', async(ctx) =>{
        if(ctx.message.text === 'Отправить'){
            // тут типа отправка сообщения наверное
            ctx.reply('Письмо отправлено, ожидайте ответ')
        }
        else{
            ctx.reply('Я вас не понял, нажмите на кнопку под клавиатурой')
        }
    })

    const askQuestionScene = new WizardScene(
        constants.SCENE_ID_ASK_QUESTION,
        enterHandler,
        addresseeHandler,
        questionTextHandler,
        confirmMessageHandler
    )
    const stage = new Stage([askQuestionScene])

    stage.hears(RETURN_BACK_MARKUP[0], ctx => ctx.scene.enter(constants.SCENE_ID_NEWS))
    stage.hears(RETURN_BACK_MARKUP[1], ctx => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))

    return stage[0]
}

module.exports = askQuestionSceneGenerate