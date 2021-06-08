const express = require("express");
const path = require("path");
const sequelize = require("./db");
const { Lesson, Teacher, Student, LessonStudent, LessonTeacher } = require("./models/models");
const { Op } = require("sequelize");
const e = require("express");
const app = express();

app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

const start = async () => {


  function getDates(start, arrayOfWeekDay, count){
    const date = start
    const ms = Date.parse(date)
    let day = new Date()
    day.setTime(ms)
    
    
    const arDay = arrayOfWeekDay
    const arrDate = []
    
    let i = count
    let j = ms
    
    while (i>0) {
      let dayOf = day.getDay()
    
        if (arDay.includes(dayOf))
          {
    let year = day.getFullYear()
    let month = day.getMonth()+1 < 10 ? '0'+(day.getMonth()+1) :day.getMonth()+1
    let d = day.getDate() < 10 ? '0' +day.getDate() : day.getDate();
    let dayW = year +'-'+ month +'-'+ d
            arrDate.push(dayW)
           arrDate.length >= 5 ? i = 0 : i = i
          }
          i--
          j += 86400000
    day.setTime(j)
      
    }
    
    return arrDate
    
    }




  try {
    await sequelize.authenticate();
    await sequelize.sync();

    //------GET METHOD -----//
    app.get("/", async (req, res) => {
      try {
        let { date, status, teachersId, studentsCount, page, lessonsPerPage } =
          req.query;

        date = date ? date.split(",") : undefined;

        status = status ? status : undefined;

        teachersId = teachersId ? teachersId.split(",") : null;

        studentsCount ? studentsCount.split(",") : null;

        page = page || 1;
        lessonsPerPage = lessonsPerPage || 5;
        let limit = lessonsPerPage;
        let offset = page * limit - limit;

        console.log("search");

        const data = await Lesson.findAll({
          // subQuery: false,
          /*   attributes: {
                include: [[sequelize.fn("COUNT", sequelize.col('lesson.lesson_students.visit')), 'visitCount']]

            },
*/
          include: [
            {
              model: Teacher,
              where: {
                id: teachersId ? { [Op.in]: teachersId } : { [Op.ne]: null },
              },
            },

            {
              model: Student,
              /*  include: [
                  {

                    model: LessonStudent,
                    //attributes: [[sequelize.fn("COUNT", sequelize.col('visit')), 'visitCount']],
                    where: {visit: true}

                  }
              ]*/
            },
          ],

          where: {
            date: date
              ? { [Op.or]: [date, { [Op.between]: date }] }
              : { [Op.ne]: null },
            status: status ? status : { [Op.ne]: null },
          },
          //   group: ['lesson.id']
        });
        console.log("search complete");

        const ololo = JSON.stringify(data);
        const blo = JSON.parse(ololo);

        const countedByStudents = [];

        if (studentsCount !== undefined) {
          const count = studentsCount.split(",").map((x) => parseInt(x));

          if (count[1] - count[0] < 0) {
            res.status(400).json({
              message: "in studentsCount[X,Y] X should always be less then Y",
            });
          }

          if (count.length === 1) {
            blo.forEach((element) => {
              if (element.students.length == count[0]) {
                countedByStudents.push(element);
              }
            });
          }
          if (count.length === 2) {
            blo.forEach((element) => {
              if (
                element.students.length >= count[0] &&
                element.students.length <= count[1]
              ) {
                console.log("PUSHING ELEMENT");
                countedByStudents.push(element);
              }
            });
          }
          if (count.length > 2) {
            res.status(400).json({
              message: "only two values of studentsCount are allowed ",
            });
          }
        }

        if (countedByStudents.length !== 0) {
          console.log("response counter");
          res.status(200).json(countedByStudents);
        } else res.status(200).json(data);
      } catch (e) {
        console.log(e);
        res.status(400).json({ message: e.message });
      }
      //  res.render('home', {content: 'THIS IS HOOOOOOME'})
    });

    app.post("/lessons", async (req, res) => {
      try {
        console.log("trying to post on /lessons");

        let { teachersIds, title, days, firstDate, lessonsCount, lastDate } =
          req.body;

        console.log(
          teachersIds,
          title,
          days,
          firstDate,
          lessonsCount,
          lastDate
        );








        if (lessonsCount && !lastDate) {



const arrDays = getDates(firstDate, days, lessonsCount)


arrDays.forEach(async (element) => {
  await Lesson
  .create({
    date: element,
    title: title,
    })
   /* .then((async(data) => {
      LessonTeacher.create({
        where: {
          lesson_id: data.id,
          teachers_id: { [Op.in]: teachersIds }

        }
      })
    }))*/
});






















            console.log('all good')
        //  res.status(200).json({ message: "lesson count" });
        }

        if (lastDate && !lessonsCount) {
          res.status(200).json({ message: "last date" });
        } else {
         // res.status(400).json({ message: "errororororororororo" });
         
        }
        res.status(200).json({ message: "end" });
      } catch (e) {
        console.log(e);
        res.status(400).json({ message: e.message });
      }
    });

    app.listen(PORT, () =>
      console.log(`---------server started at https://localhost:${PORT} ---- `)
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "something wrong on serever side" });
  }
};

start();
