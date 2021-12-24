const { Scenes, Markup} = require('telegraf')
const constants = require("../../../model/constants")
const defaultAct = require("../../../DefaultAct")

// клавиатура назад / главное меню 
const FAQ_MARKUP = Markup.keyboard([
    [constants.BUTTON_TEXT_BACK, constants.BUTTON_TEXT_MAIN_MENU]
]).resize(true)

const topics = ["стипендии", "работа деканата", "расписание преподавателей",
    "сроки сессий", "сроки каникул", "оформление академ отпуска",
    "получение справок", "и т.д."]

// генерация сцены faq
function faqSceneGenerate() {
    const faqScene = new Scenes.BaseScene( constants.SCENE_ID_FAQ )

    // вход в сцену
    faqScene.enter( async (ctx) => {
        await ctx.reply("Можешь задать мне вопрос ;)", FAQ_MARKUP)
        let msg = "Я могу помочь с некоторыми вопросами про:\n"
        // добавление в текст сообщения темы главных вопросов
        topics.forEach((topic) => {
            msg += `- ${topic};\n`
        })
        await ctx.reply(msg)
    })

    // функция с методами для всех сцен, передается сама сцена и сцена для возвращения назад    
    defaultAct(faqScene, constants.SCENE_ID_NEWS)
    return faqScene
}

module.exports = faqSceneGenerate