class Lesson {
    constructor(start, end, day, tip, place, event, disciplina, lichnost) {
        this.start = start
        this.end = end
        this.day = day
        this.tip = tip
        this.place = place
        this.event = event
        this.disciplina = disciplina
        this.lichnost = lichnost
    }
}

class Place {
    constructor(nomer, korpus) {
        this.nomer = nomer
        this.korpus = korpus
    }
}

class Disciplina {
    constructor(full_name) {
        this.full_name = full_name
    }
}

class Lichnost {
    constructor(title) {
        this.title = title
    }
}

module.exports = Lesson
module.exports = Place
module.exports = Disciplina
module.exports = Lichnost
