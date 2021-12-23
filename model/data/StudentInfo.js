class StudentInfo {

    constructor({
                    gruppa,
                    gradebook_number,
                    department,
                    status,
                    direction_of_training,
                    form_of_education,
                    type_of_financing,
                }) {

        this.gruppa = gruppa
        this.gradebook_number = gradebook_number
        this.department = department
        this.status = status
        this.direction_of_training = direction_of_training
        this.form_of_education = form_of_education
        this.type_of_financing = type_of_financing

    }
}

module.exports = StudentInfo
