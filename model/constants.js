const constants = {

    // Bot messages
    TEXT_INTRODUCTION: "Привет, я Ассистент студента ТПУ\n" +
        "Буду рад помочь тебе освоиться внутри нашего университета\n",

    TEXT_MAIN_MENU: "Главное меню",

    TEXT_CHAT_NOT_PRIVATE: "Оу сори 😢, не могу показывать данные в группах и каналах 😢",

    TEXT_VACANCY_NUMBER: "Короче, у нас есть <b>{0}</b> работ над которыми Вы сможете поработать😏\n" +
        "Осталось только выбрать,как нужно их отсортировать🤓:",

    TEXT_VACANCY_LIST_BY_COMPANIES : "Вот, отсортировал вакансии по компаниям🤓",
    TEXT_VACANCY_LIST_BY_NAMES : "А вот, отсортировал по названиям👀",
    TEXT_VACANCY_LIST_BY_TAGS : "Вот, список работ по тегам🤪",
    TEXT_VACANCY_APPLICATION_SUCCESS : "Ухухух, вы приняты)",
    TEXT_VACANCY_APPLICATION_CANCEL : "Окей, мб найдется что-то еще? 🤞",

    // Sticker ids
    STICKER_ID_HELLO: "CAACAgIAAxkBAAIBQWFqcOBN0lWPlYl-k9HfVLNdnOHOAAKwDAAC1c7YSRgEfwPw-wzfIQQ",


    // Button texts
    // Main menu
    BUTTON_TEXT_ZERO_NEWS: "📩 Новости",
    BUTTON_TEXT_NEWS: "📩 Новости ({0})",
    BUTTON_TEXT_TIMETABLE: "📝 Расписание",
    BUTTON_TEXT_EDUCATION: "🏨 Образование",
    BUTTON_TEXT_PROFILE: "🙆‍♂️ Профиль",

    // Timetable
    BUTTON_TEXT_TT_TODAY: "Расписание на сегодня",
    BUTTON_TEXT_TT_TOMORROW: "Расписание на завтра",
    BUTTON_TEXT_TT_DAY: "Расписание на день",

    // News
    BUTTON_TEXT_POSTS: "Посты ({0})",
    BUTTON_TEXT_POLLS: "Голосования ({0})",
    BUTTON_TEXT_FEEDBACK: "Обратная связь",
    BUTTON_TEXT_ASK_QUESTION: "Задать вопрос Q&A",
    BUTTON_TEXT_FAQ: "Задать вопрос FAQ",

    // Education
    BUTTON_TEXT_CAMPUS: "🗺 Кампус",
    BUTTON_TEXT_EDUCATION_PROGRAM: "Образовательная программа",
    BUTTON_TEXT_CAMPUS_MAP: "GoogleMaps",
    BUTTON_TEXT_CAMPUS_LIST: "Посмотреть списком",

    // AskQuestion
    BUTTON_TEXT_DEAN: "Деканат",
    BUTTON_TEXT_STUDENT_COUNCIL: "Студсовет",
    BUTTON_TEXT_STUDENTS: "Студенты",

    // Show vacancies
    // Button texts
    BUTTON_TEXT_VACANCIES: "Вакансии ({0}) (Тест)",
    BUTTON_TEXT_SORT_BY_COMPANIES : "Компании",
    BUTTON_TEXT_SORT_BY_POSITIONS : "Вакансии",
    BUTTON_TEXT_SORT_BY_TAGS : "Теги",

    // Else
    BUTTON_TEXT_BACK: "Назад",
    BUTTON_TEXT_MAIN_MENU: "⚙️ Главное меню",
    BUTTON_TEXT_START: "/start",


    // Scene ids
    SCENE_ID_START: 'start',
    SCENE_ID_MAIN_MENU: 'main_menu',
    SCENE_ID_EDUCATION: 'education',
    SCENE_ID_CAMPUS: 'campus',
    SCENE_ID_CHAT_NOT_PRIVATE: 'chat_not_private',
    SCENE_ID_PROFILE: 'profile',
    SCENE_ID_FEEDBACK: 'feedback',
    SCENE_ID_NEWS: 'news',
    SCENE_ID_ASK_QUESTION: 'ask_question',
    SCENE_ID_POLLS: 'polls',
    SCENE_ID_POSTS: 'posts',
    SCENE_ID_TIMETABLE: 'timetable',
    SCENE_ID_FAQ: 'faq',
    SCENE_ID_VACANCY: 'vacancy',

    DEVELOPERS_GROUP: [-699676297]

}

module.exports = constants