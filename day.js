function getDates(start, arrayOfWeekDay, count){
const date = '2021-06-07'
const ms = Date.parse(date)
console.log(ms)
let day = new Date()
day.setTime(ms)


const arDay = [0,2,4]
const arrDate = []

let i = 20
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
