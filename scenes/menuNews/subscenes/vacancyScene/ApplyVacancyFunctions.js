const { Scenes, Markup } = require('telegraf')
const format = require('string-format')

const { Buffer } = require('buffer')
const constants = require("../../../../model/constants");
const DataBus = require("../../../../model/DataBus");

format.extend(String.prototype, {})

const CHOICE_MARKUP = Markup.inlineKeyboard([
    Markup.button.callback("Да", 'btn_yes'),
    Markup.button.callback("Нет", 'btn_no')
]).resize(true)

// apply vacancy
async function applyVacancy(ctx) {

    // Decode message
    const decodedStr = new Buffer
        .from(ctx.message.text.substr(4), 'base64')
        .toString('ascii');

    // Find record
    const vacancy = DataBus.vacancies.filter( record => record.click.includes(decodedStr))

    // Check if record is found
    if (vacancy.length === 0) {
        await ctx.reply("Не нашел вакансии")
        // TODO: Перейти в меню новости
        // await ctx.scene.leave()
    } else {
        ctx.scene.state.record = vacancy[0]
        await ctx.reply(`Вы действительно хотите отправить заявку на ${ctx.scene.state.record.vacancy}?`, CHOICE_MARKUP)
    }

}

// Check confirm
async function confirmVacancyApplication(ctx) {
    if (ctx.callbackQuery?.data === "btn_yes") {

        // Set vacancy in user's data
        let is_set = false
        await ctx.reply(constants.TEXT_VACANCY_APPLICATION_SUCCESS)


        // constants.users.forEach( user => {
        //     if (user["user_telegram_id"] === ctx.message.from.id){
        //
        //         // Check if user has already applied
        //         if (!user["vacancies"].includes(ctx.scene.state.record.vacancy_id)){
        //             user["vacancies"].push(ctx.scene.state.record.vacancy_id)
        //             is_set = true
        //         } else {
        //             ctx.reply("Вы уже откликнулись на данную вакансию", SORT_MARKUP)
        //         }
        //     }
        // })
        //
        // // Notify employer
        // if (is_set) {
        //     const employer_chat_id = ctx.scene.state.record.employer_chat_id
        //     const username = ctx.message.from.username
        //     const recordVacancy = ctx.scene.state.record["vacancy"]
        //
        //     await ctx.telegram.sendMessage(employer_chat_id, "Отклик от пользователя @{0} на роль {1} ".format(username, recordVacancy))
        //     await ctx.replyWithSticker(constants.STICKER_ID_DANCE)
        //     await ctx.reply(constants.TEXT_VACANCY_APPLICATION_SUCCESS, SORT_MARKUP)
        // }
        //

    } else if (ctx.callbackQuery?.data === "btn_no") {
        // await ctx.replyWithSticker(constants.STICKER_ID_DONT_KNOW, SORT_MARKUP)
        await ctx.reply(constants.TEXT_VACANCY_APPLICATION_CANCEL)
        // TODO: Перейти в меню новости
        // await ctx.scene.leave()
    }

}

module.exports = {
    applyVacancy,
    confirmVacancyApplication
}