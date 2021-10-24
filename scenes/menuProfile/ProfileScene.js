const {Scenes, Markup} = require('telegraf')
const constants = require("../../constants")

const PROFILE_MARKUP = Markup.keyboard(
    constants.BUTTON_TEXT_MAIN_MENU
)

function profileSceneGenerate() {
    const profileScene = new Scenes.BaseScene(constants.SCENE_ID_PROFILE)
    profileScene.enter(async (ctx) => {
        if (ctx.session.user) {
            const user = ctx.session.user
            await ctx.reply(`Имя: ${user.first_name}\nФамилия: ${user.last_name}\nПочта ТПУ: ${user.email}`)
        }

    })
    profileScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))

    return profileScene
}

module.exports = profileSceneGenerate