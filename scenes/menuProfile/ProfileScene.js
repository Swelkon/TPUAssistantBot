const {Scenes, Markup} = require('telegraf')
const constants = require("../../model/constants")
const DataBus = require("../../model/DataBus")
const defaultAct = require("../../DefaultAct")

const PROFILE_MARKUP = Markup.keyboard([
        constants.BUTTON_TEXT_MAIN_MENU
    ]).resize(true)

function profileSceneGenerate() {
    const profileScene = new Scenes.BaseScene(constants.SCENE_ID_PROFILE)

    profileScene.enter(async (ctx) => {
        const user = DataBus.getUser({ctx: ctx})
        if (user) {
            await ctx.reply(`Имя: ${user.first_name}\nФамилия: ${user.last_name}\nПочта ТПУ: ${user.email}\nГруппа: ${user.gruppa}\nШкола: ${user.department}\nНаправление: ${user.direction_of_training}\nФорма обучения: ${user.form_of_education}\nТип финансирования: ${user.type_of_financing}`, PROFILE_MARKUP)
        } else {
            await ctx.reply("Не вижу ваш профиль 🐀")
            await ctx.reply("Попробуйте перезайти через почту ТПУ")
            await ctx.scene.enter(constants.SCENE_ID_START)
        }
    })
    

    defaultAct(profileScene, constants.SCENE_ID_MAIN_MENU)
    return profileScene
}

module.exports = profileSceneGenerate