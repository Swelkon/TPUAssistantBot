const { Scenes, Markup } = require('telegraf')
const constants = require("../../../model/constants")
const format = require("string-format");
const { sortByCompany, sortByVacancy, sortByTags } = require('./vacancyScene/SortSceneFunctions')
const showVacancy = require("./vacancyScene/ShowVacancyFunctions");
const {applyVacancy, confirmVacancyApplication} = require("./vacancyScene/ApplyVacancyFunctions");
const DataBus = require("../../../model/DataBus");
const defaultAct = require("../../../DefaultAct");

format.extend(String.prototype, {})

// клавиатура раздела вакансий: типы сортировки и навигация назад / главное меню
const markup = Markup.keyboard([
    [
        constants.BUTTON_TEXT_SORT_BY_COMPANIES,
        constants.BUTTON_TEXT_SORT_BY_POSITIONS,
        constants.BUTTON_TEXT_SORT_BY_TAGS],
    [
        constants.BUTTON_TEXT_BACK,
        constants.BUTTON_TEXT_MAIN_MENU
    ]]).resize(true)

// генерация сцены старта
function vacancySceneGenerate() {
    const  vacancyScene = new Scenes.BaseScene( constants.SCENE_ID_VACANCY )

    // вход в сцену
    vacancyScene.enter( async  (ctx) => {
        await ctx.reply( constants.TEXT_VACANCY_NUMBER.format(DataBus.vacancies.length),  {
            parse_mode: 'HTML',
            reply_markup: markup.reply_markup
        })
    })

    // сортировка вакансий по соответствующему типу
    vacancyScene.hears(constants.BUTTON_TEXT_SORT_BY_COMPANIES, sortByCompany)
    vacancyScene.hears(constants.BUTTON_TEXT_SORT_BY_POSITIONS, sortByVacancy)
    vacancyScene.hears(constants.BUTTON_TEXT_SORT_BY_TAGS, sortByTags)
    // вывод отсортированных вакансий по группе
    vacancyScene.action(new RegExp('get_vacancies\\/(\\w+)\\/(\\w+)'), showVacancy)
    // вызов функции отклика на вакансию
    vacancyScene.hears(new RegExp('/ar_'), applyVacancy)
    // вызов функции подтверждения заявки на вакансию
    vacancyScene.action(['btn_yes', 'btn_no'], confirmVacancyApplication)

    // функция с методами для всех сцен, передается сама сцена и сцена для возвращения назад
    defaultAct(vacancyScene, constants.SCENE_ID_NEWS)
    return vacancyScene
}

module.exports =  vacancySceneGenerate