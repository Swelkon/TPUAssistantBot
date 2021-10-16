const { Scenes, Markup } = require('telegraf')
const constants = require("../../constants")

const EDUCATION_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_CAMPUS_MAP,
    constants.BUTTON_TEXT_EDUCATION_PROGRAM,
]).resize(true)

function educationSceneGenerate() {
    const  educationScene = new Scenes.BaseScene( constants.SCENE_ID_EDUCATION_SCENE )
    educationScene.enter( async (ctx) => {
        await ctx.reply( "Раздел Образование", EDUCATION_MARKUP)
    })

    educationScene.hears(constants.BUTTON_TEXT_CAMPUS_MAP, async (ctx) => {

    })
    return  educationScene
}

module.exports =  educationSceneGenerate