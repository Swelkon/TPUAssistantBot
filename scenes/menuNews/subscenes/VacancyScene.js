const { Scenes, Markup } = require('telegraf')
const constants = require("../../../model/constants")
const format = require("string-format");
const { sortByCompany, sortByVacancy, sortByTags } = require('./vacancyScene/SortSceneFunctions')
const showVacancy = require("./vacancyScene/ShowVacancyFunctions");
const {applyVacancy, confirmVacancyApplication} = require("./vacancyScene/ApplyVacancyFunctions");
const DataBus = require("../../../model/DataBus");
const defaultAct = require("../../../DefaultAct");

format.extend(String.prototype, {})

const markup = Markup.keyboard(    [
    [
        constants.BUTTON_TEXT_SORT_BY_COMPANIES,
        constants.BUTTON_TEXT_SORT_BY_POSITIONS,
        constants.BUTTON_TEXT_SORT_BY_TAGS],
    [
        constants.BUTTON_TEXT_BACK,
        constants.BUTTON_TEXT_MAIN_MENU
    ]
])
    .resize(true)

function vacancySceneGenerate() {
    const  vacancyScene = new Scenes.BaseScene( constants.SCENE_ID_VACANCY )
    vacancyScene.enter( async  (ctx) => {
        await ctx.reply( constants.TEXT_VACANCY_NUMBER.format(DataBus.vacancies.length),  {
            parse_mode: 'HTML',
            reply_markup: markup.reply_markup
        })
    })

    vacancyScene.hears(constants.BUTTON_TEXT_SORT_BY_COMPANIES, sortByCompany)
    vacancyScene.hears(constants.BUTTON_TEXT_SORT_BY_POSITIONS, sortByVacancy)
    vacancyScene.hears(constants.BUTTON_TEXT_SORT_BY_TAGS, sortByTags)
    vacancyScene.action(new RegExp('get_vacancies\\/(\\w+)\\/(\\w+)'), showVacancy)
    vacancyScene.hears(new RegExp('/ar_'), applyVacancy)
    vacancyScene.action(['btn_yes', 'btn_no'], confirmVacancyApplication)

    defaultAct(vacancyScene, constants.SCENE_ID_NEWS)
    return vacancyScene
}

module.exports =  vacancySceneGenerate