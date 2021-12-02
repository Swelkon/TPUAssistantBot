// example of the response from the server
const lessons = [
    {
        "start": "2021-11-08 08:30:00",
        "end": "2021-11-08 10:05:00",
        "weekday": "Monday",
        "tip": "Лабораторная работа",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Тестирование программного обеспечения"
        },
        "lichnost": [
            {
                "title": "Копнов М. В."
            }
        ]
    },
    {
        "start": "2021-11-10 08:30:00",
        "end": "2021-11-10 18:05:00",
        "weekday": "Wednesday",
        "tip": "Практика",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Военная подготовка"
        },
        "lichnost": []
    },
    {
        "start": "2021-11-11 12:40:00",
        "end": "2021-11-11 14:15:00",
        "weekday": "Thursday",
        "tip": "Лабораторная работа",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Разработка приложений для мобильных устройств"
        },
        "lichnost": [
            {
                "title": "Дорофеев В. А."
            }
        ]
    },
    {
        "start": "2021-11-11 12:40:00",
        "end": "2021-11-11 14:15:00",
        "tip": "Лекция",
        "place": null,
        "event": null,
        "disciplina": {
            "full_name": "Компьютерная графика, виртуальная и дополненная реальность"
        },
        "lichnost": [
            {
                "title": "Демин А. Ю."
            }
        ]
    },
    {
        "start": "2021-11-12 16:30:00",
        "end": "2021-11-12 18:05:00",
        "tip": "Лабораторная работа",
        "weekday": "Friday",
        "place": {
            "nomer": "403Б",
            "korpus": "10"
        },
        "event": null,
        "disciplina": {
            "full_name": "Методы машинного обучения"
        },
        "lichnost": [
            {
                "title": "Друки А. А."
            }
        ]
    }
]

module.exports = lessons