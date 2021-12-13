const axios = require("axios")
const { Scenes } = require('telegraf')
const constants = require("../../../model/constants")
const defaultAct = require("../../../DefaultAct")
const DataBus = require("../../../model/DataBus");

async function requestApi(ctx) {
    axios.post('https://tpuassistant.azurewebsites.net/qnamaker/knowledgebases/0091b6d8-4f85-457f-a453-151ae6ccb8b5/generateAnswer',
    {'question': ctx.message.text}, {
        headers: {
            'Authorization': 'EndpointKey 82746f7e-aef7-4477-9042-d7598c9e436c',
            'Content-Type': 'application/json'
        }      
    })      
    .then((response) => { 
        var answer = response.data.answers[0].answer.toString()

        if(answer == 'No good match found in KB.') 
            ctx.reply('Извини, я такое не знаю :(')
        else 
            ctx.reply(answer)
    })
}

const topics = ["стипендии", "работа деканата", "и т.д."]

function faqSceneGenerate() {
    const faqScene = new Scenes.BaseScene( constants.SCENE_ID_FAQ )

    faqScene.enter( async (ctx) => {
        await ctx.reply("Можешь задать мне вопрос ;)")
        let msg = "Я могу помочь с некоторыми вопросами про:"
        topics.forEach((topic) => {
            msg += `- ${topic};\n`
        })
        await ctx.reply(msg)

    })


    defaultAct(faqScene, constants.SCENE_ID_NEWS)
    return faqScene
}

module.exports = faqSceneGenerate