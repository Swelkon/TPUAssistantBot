class Lesson {
    constructor(id, start, end, tip, place, event, disciplina, lichnost=[]) {
        this.id = id
        this.date = new Date(start)
        this.start = start.slice(11,-3)
        this.end = end.slice(11,-3)
        this.tip = tip
        this.place = place
        this.where = `/where_${id}`
        this.event = event
        this.disciplina = disciplina
        this.lichnost = lichnost
    }
}

module.exports = Lesson