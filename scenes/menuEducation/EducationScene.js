const { Scenes, Markup } = require('telegraf')
const constants = require("../../model/constants")
const defaultAct = require("../../DefaultAct")

// сцена не задействована

// клавиатура кампус / образовательная программа
const EDUCATION_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_CAMPUS,
    constants.BUTTON_TEXT_EDUCATION_PROGRAM,
    constants.BUTTON_TEXT_MAIN_MENU
]).resize(true)

// генерация сцены образования
function educationSceneGenerate() {
    const  educationScene = new Scenes.BaseScene( constants.SCENE_ID_EDUCATION )

    // вход в сцену
    educationScene.enter( async (ctx) => {
        await ctx.reply( 'Раздел "Образование"', EDUCATION_MARKUP)
    })

    // переход в сцену кампуса 
    educationScene.hears(constants.BUTTON_TEXT_CAMPUS, async (ctx) => ctx.scene.enter(constants.SCENE_ID_CAMPUS))

    // функция с методами для всех сцен, передается сама сцена и сцена для возвращения назад
    defaultAct(educationScene, constants.SCENE_ID_MAIN_MENU)
    return  educationScene
}

module.exports =  educationSceneGenerate