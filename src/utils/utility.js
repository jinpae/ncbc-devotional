export function getDate(){
  const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
  var dateYear = (new Date()).toString().split(' ').splice(2,2).join(' ');
  return monthNames[(new Date().getMonth())] + " " + dateYear;
}

export function prepScripture({chapter, verse}){
  if(chapter.from === chapter.to){
    return ` ${chapter.from}:${verse.from}-${verse.to}`
  } else {
  return ` ${chapter.from}:${verse.from}-${chapter.to}:${verse.to}`
  }
}