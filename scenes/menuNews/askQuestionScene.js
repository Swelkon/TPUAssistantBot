const { Scenes: {WizardScene, Stage}, Composer, Markup} = require('telegraf')
const constants = require("../../constants")

const ASK_QUESTION_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_DEAN,
    constants.BUTTON_TEXT_STUDENT_COUNCIL,
    constants.BUTTON_TEXT_STUDENTS
])

function askQuestionSceneGenerate() {
    // handlers
    const enterHandler = new Composer()
    enterHandler.on('text', async (ctx) => {
        await ctx.reply('Кому вы хотите задать вопрос?', ASK_QUESTION_MARKUP)
        return ctx.wizard.next()
    })

    const addresseeHandler = new Composer()
    addresseeHandler.on('text', async(ctx) => {
        if(ctx.message.text === constants.BUTTON_TEXT_DEAN){
            ctx.state.addressee = constants.BUTTON_TEXT_DEAN
        }
        if(ctx.message.text === constants.BUTTON_TEXT_STUDENT_COUNCIL){
            ctx.state.addressee = constants.BUTTON_TEXT_STUDENT_COUNCIL
        }
        if(ctx.message.text === constants.BUTTON_TEXT_STUDENTS){
            ctx.state.addressee = constants.BUTTON_TEXT_STUDENTS
        }
        else{
            ctx.reply('Я вас не понял')
            return ctx.wizard.selectStep(ctx.wizard.cursor - 1) // returning to previous handler
        }
        ctx.reply('Напишите текст вопроса')
        return ctx.wizard.next()
    })

    const questionTextHandler = new Composer()
    questionTextHandler.on('text', async(ctx) => {
        ctx.state.questionText = ctx.message.text
        ctx.reply('Подтвердите отправку', Markup.keyboard[['Отправить']])
        ctx.reply(`Адресат: ${ctx.state.addressee}\n\nВопрос:\n\n${ctx.state.questionText}`)
        return ctx.wizard.next()
    })

    const confirmMessageHandler = new Composer()
    confirmMessageHandler.on('Отправить', async(ctx) =>{
        // тут типа отправка сообщения наверное
        ctx.reply('Письмо отправлено, ожидайте ответ')
        ctx.scene.leave()
    })

    const askQuestionScene = new WizardScene(
        constants.SCENE_ID_ASK_QUESTION,
        enterHandler,
        addresseeHandler,
        questionTextHandler,
        confirmMessageHandler
    )
    const stage = new Stage([askQuestionScene])

    return stage[0]
}

module.exports =  educationSceneGenerate