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
        const studentInfo = DataBus.getStudentInfo({ctx: ctx})
        if (user) {
            let msg = "Ваш профиль:\n"
            msg += `📍 Имя: ${user.first_name}\n`
            msg += `📍 Фамилия: ${user.last_name}\n`
            msg += `📍 Почта ТПУ: ${user.email}\n`
            if (studentInfo){
                msg += `📍 Группа: ${studentInfo.gruppa}\n`
                msg += `📍 Номер зачетной книжки: ${studentInfo.gradebook_number}\n`
                msg += `📍 Школа: ${studentInfo.department}\n`
                msg += `📍 Направление обучения: ${studentInfo.direction_of_training}\n`
                msg += `📍 Форма обучения: ${studentInfo.form_of_education}\n`
                msg += `📍 Тип обучения: ${studentInfo.type_of_financing}\n`
                msg += `📍 Статус: ${studentInfo.status}\n`
            }

            await ctx.reply( msg, PROFILE_MARKUP)
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