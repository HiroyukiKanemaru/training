const calendar = document.querySelector(".calendar");
const monthBanner = document.querySelector(".date");//カレンダーTOPの年月日
const daysContainer = document.querySelector(".days");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");
const addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月",
];

//const eventsArr = [
//    {
//        day: 16,
//        month: 5,
//        year: 2023,
//        events: [
//            {
//                title: "Event1",
//                time: "10:00",
//            },
//            {
//                title: "Event2",
//                time: "13:00",
//            },
//        ],
//    },
//];

let eventsArr = [];
getEvents();

//日にちをカレンダーへ追加 dateは日、dayは曜日。
function loadCarendar() {
    //当月の最初の日の情報を取得(引数を指定しないと現在の情報、変な数字が入るので注意)
    const firstDay = new Date(year, month, 1);//Mon May 01 2023 00:00:00 GMT+0900 (日本標準時)
    //当月の最後の日の情報を取得（月に＋１をして０とすると先月の最後の日の情報を取得）
    const lastDay = new Date(year, month + 1, 0);//Wed May 31 2023 00:00:00 GMT+0900 (日本標準時)
    //先月の最後の日の情報を取得
    const prevLastDay = new Date(year, month, 0);//Sun Apr 30 2023 00:00:00 GMT+0900 (日本標準時)
    //日付のみを取り出して格納
    const prevDays = prevLastDay.getDate();//30
    const lastDate = lastDay.getDate();//31
    const day = firstDay.getDay();//1
    //来月分の表示日数を計算し格納
    const nextDays = 7 - lastDay.getDay() - 1;//3 = 7-3(水曜日なので日曜日を0とすると水曜日は3-1)
    //カレンダーTOPの年月日の書き出し処理
    monthBanner.innerText = year + "年" + months[month];

    //日付の空箱準備
    let days = "";
    //最終日を取得しカレンダーへ書き込み
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }
    //本日の日付を取得しカレンダーへ書き込み
    for (let i = 1; i <= lastDate; i++) {
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });

        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {
            if (event) {
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        }
        else {
            if (event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                //本日以外をカレンダーへ書き込み
                days += `<div class="day">${i}</div>`;
            }
        }
    }
    //来月分をカレンダーへ書き込み
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }
    //innerHTMLへ書き出し処理
    daysContainer.innerHTML = days;
    addListener();
}
loadCarendar();

//カレンダー送り戻りボタン機能実装
//カレンダー月戻り
function prevMonth() {
    month--;
    //月が０の時は、１２月を格納し年はマイナスする
    if (month < 0) {
        month = 11;
        year--;
    }
    loadCarendar();
}
//カレンダー月送り
function nextMonth() {
    month++;
    //月が０の時は、１月を格納し年はプラスする
    if (month > 11) {
        month = 0;
        year++;
    }
    loadCarendar();
}
//カレンダー年戻り
function prevYear() {
    year--;
    loadCarendar();
}
//カレンダー年送り
function nextYear() {
    year++;
    loadCarendar();
}
//ボタンクリック時の動作設定
btnPrev.addEventListener("click", prevMonth);//月戻り
btnNext.addEventListener("click", nextMonth);//月進み
btnPrevYear.addEventListener("click", prevYear);//年戻り
btnNextYear.addEventListener("click", nextYear);//年進み

//TODAYボタンクリック時の動作設定
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    loadCarendar();
});

//イベント入力フォームのボタン処理追加
const addEventBtn = document.querySelector(".add-event");
const addEventContainer = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");

//イベント追加ボタンがクリックされるとフォームを立ち上がる処理
addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});
//イベント追加フォームの閉じるボタンをクリックするとフォームがクローズする処理
addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});
//フォーム以外をクリックすると閉じる
document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.remove("active");
    }
});

//インプットBoxを入力規制
const addEventTitle = document.querySelector(".event-name");
const addEventFrom = document.querySelector(".event-time-from");
const addEventTo = document.querySelector(".event-time-to");

//Training Nemuの入力文字数を50以下へ制御
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 20);
});
//開始時間の入力規制/2文字入力後：を入力し４文字以下
addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
});
//終了時間も開始時間と同じ入力規制
addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
});
//先月、来月の日付をクリックした時その月のカレンダーへ移動する
function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = Number(e.target.innerHTML);

            getActiveDay(e.target.innerHTML);
            updateEvents(Number(e.target.innerHTML));

            days.forEach((day) => {
                day.classList.remove("active");
            });
            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add("active");
            }
        });
    });
}

//右側上の日付表示
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = year + "年" + months[month] + date + "日";
};

function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            event.events.forEach((event) => {
                events += `
                <div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>`;
            });
        }
    });
    if (events === "") {
        events = `<div class="no-event">
        <h3>No Events</h3>
        </div>`;
    }
    eventsContainer.innerHTML = events;
    saveEvents();
}
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill all the fields");
        return;
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if (
        timeFromArr.length != 2 ||
        timeToArr.length != 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert("Invalid Time Format");
    }
    const timeFrom = convertTime(eventTimeFrom);
    const timeto = convertTime(eventTimeTo);

    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeto,
    };
    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }
    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        })
    }

    addEventContainer.classList.remove("active");

    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    updateEvents(activeDay);

    const activeDayElem = document.querySelector(".day.active");
    if (!activeDayElem.classList.contains("event")) {
        activeDayElem.classList.add("event");
    }

});
function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "AM" : "PM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}

eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;
        eventsArr.forEach((event) => {
            if (
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            ) {
                event.events.forEach((item, index) => {
                    if (item.title === eventTitle) {
                        event.events.splice(index, 1);
                    }
                });
                if (event.events.length === 0) {
                    eventsArr.splice(eventsArr.indexOf(event), 1);
                    const activeDayElem = document.querySelector(".day.active");
                    if (activeDayElem.classList.contains("event")) {
                        activeDayElem.classList.remove("event");
                    }
                }
            }
        });
        updateEvents(activeDay);
    }
});
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
    if (localStorage.getItem("events" === null)) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}
