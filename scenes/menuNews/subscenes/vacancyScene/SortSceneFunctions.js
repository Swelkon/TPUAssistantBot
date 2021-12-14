const { Markup } = require('telegraf')
const format = require('string-format')
const constants = require("../../../../model/constants");
const DataBus = require("../../../../model/DataBus");

format.extend(String.prototype, {})

function getMarkupButtonList(column, shortlistDict){
    const buttons = []
    for (let name in shortlistDict) {
        let number = shortlistDict[name]
        const button = Markup.button.callback("{0} ({1})".format(name, number), "get_vacancies/{0}/{1}".format(column, name))

        buttons.push(button)
    }
    return Markup.inlineKeyboard(buttons, {
        columns: 2
    })

}


async function sortByCompany (ctx) {
    const shortList = getListCompany()
    await ctx.reply(constants.TEXT_VACANCY_LIST_BY_COMPANIES, getMarkupButtonList('company', shortList))
}

async function sortByVacancy(ctx) {
    const shortList = getListVacancy()
    await ctx.reply(constants.TEXT_VACANCY_LIST_BY_NAMES, getMarkupButtonList('vacancy', shortList))
}

async function sortByTags(ctx) {
    const shortList = getListTags()
    await ctx.reply(constants.TEXT_VACANCY_LIST_BY_TAGS, getMarkupButtonList('tags', shortList))
}

// Data-prepare functions
function getListCompany(){
    const records = DataBus.vacancies
    let companyDict = {}
    records.forEach( record => {
        if ( ! (record.company in companyDict)) {
            companyDict[record['company']] = 0
        }
        companyDict[record['company']] += 1
    } )

    return companyDict
}

function getListVacancy(){
    const records = DataBus.vacancies
    let vacancyDict = {}
    records.forEach( record => {
        if ( ! (record.vacancy in vacancyDict)) {
            vacancyDict[record['vacancy']] = 0
        }
        vacancyDict[record['vacancy']] += 1
    } )

    return vacancyDict
}

function getListTags(){
    const records = DataBus.vacancies
    let tagsDict = {}
    records.forEach( record => {
        record['tags'].forEach(
            tag => {
                if ( ! (tag in tagsDict)) {
                    tagsDict[tag] = 0
                }
                tagsDict[tag] += 1
            }
        )

    } )

    return tagsDict
}

module.exports = {
    sortByCompany,
    sortByVacancy,
    sortByTags
}
