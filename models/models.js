const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Lesson = sequelize.define('lesson',
{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    date: {type: DataTypes.DATEONLY,  allowNull: false},
    title: {type: DataTypes.STRING(100)},
    status: {type: DataTypes.INTEGER, defaultValue: 0}
}, {
    timestamps: false
  }

);

const Teacher = sequelize.define('teacher',
{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING(10)},
    
}, {
    timestamps: false
  }

);

const Student = sequelize.define('student',
{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING(10)},
    
}, {
    timestamps: false
  }

);

const LessonTeacher = sequelize.define('lesson_teacher',
{}, {
    timestamps: false, underscored: true
  }

);

const LessonStudent = sequelize.define('lesson_student',

{visit: {type: DataTypes.BOOLEAN, defaultValue: false}}, {
    timestamps: false, underscored: true

  }

);


Lesson.belongsToMany(Teacher, {through: LessonTeacher})
Teacher.belongsToMany(Lesson, {through: LessonTeacher})

Lesson.belongsToMany(Student, {through: LessonStudent})
Student.belongsToMany(Lesson, {through: LessonStudent})

module.exports = {Lesson, Teacher, Student, LessonTeacher, LessonStudent}