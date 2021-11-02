const {Scenes, Markup} = require('telegraf')
const constants = require("../../constants")
const DataBus = require("../../model/DataBus")


const PROFILE_MARKUP = Markup.keyboard([
        constants.BUTTON_TEXT_MAIN_MENU
    ]
).resize(true)

function profileSceneGenerate() {
    const profileScene = new Scenes.BaseScene(constants.SCENE_ID_PROFILE)
    profileScene.enter(async (ctx) => {
        const user = DataBus.getUser({ctx: ctx})
        if (user) {
            await ctx.reply(`Имя: ${user.first_name}\nФамилия: ${user.last_name}\nПочта ТПУ: ${user.email}`, PROFILE_MARKUP)
        } else {
            await ctx.reply("Не вижу ваш профиль 🐀")
        }
    })
    profileScene.hears(constants.BUTTON_TEXT_MAIN_MENU, async (ctx) => ctx.scene.enter(constants.SCENE_ID_MAIN_MENU))

    return profileScene
}

module.exports = profileSceneGenerate