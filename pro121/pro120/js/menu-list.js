var btn_all_buildings = document.getElementById('btn_all_buildings'); //강의실 찾기 버튼
var btn_favorite = document.getElementById('btn_favorite'); //즐겨찾기 건물버튼
var datepicker = document.getElementById('testDatepicker'); //date picker Input
let sort = '';
var building_name = ['', '가천관', '비전타워', '법과대학', '공과대학1', '공과대학2', '바이오나노대학', 'IT대학', '한의과대학', '예술대학1', '예술대학2'];

// 검색 필터 초기화
var currentPage = 1;
let today = new Date();
let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var building = "";
let time_from_hours = today.getHours();
let time_from_minutes = today.getMinutes();
// datepicker.value = date;

let clicktimes = 0;
let reserve_from;
let reserve_to;
let room_id;

var host = "localhost"; //서버에 배포할때 변경해줘야해서
let login_id; //현재 로그인된 아이디 저장

btn_all_buildings.addEventListener('click', () => {
    // date = datepicker.value;
    $('#rooms_wrapper').html("");
    currentPage = 1;
    building = "";
    loadmore();
});

//상단 건물정렬 부분의 즐겨찾기 버튼 눌렀을때 
btn_favorite.addEventListener('click', () => {
    // date = datepicker.value;
    $('#rooms_wrapper').html("");
    currentPage = 1;
    load_favorite();
});

window.onload = () => {
    loadmore();
}


function checkLogin() {
    
    //현재 로그인된 아이디 가져오기
    $.get("http://" + host + "/getId", {

    }, function (data) {
            
        if(data == "error"){
        }
        else{
            login_id = data;
        }
    });
    
}


//즐겨찾기 목록 띄우기
function load_favorite() {
        
    //현재 로그인된 아이디 가져오기
    $.get("http://" + host + "/getId", {

    }, function (data) {
            
        if(data == "error"){
            alert("로그인 후 이용하여주시기 바랍니다.");
            window.location.href = "http://" + host + "/menu-list";
        }
        else{
            login_id = data;
        }
    });

    $.ajax({
            url: 'http://' + host + '/favorites',
            type: 'GET',
            data: {
                currentPage: currentPage,
                date: date,
                time_from_hours: time_from_hours,
                time_from_minutes: time_from_minutes,
                capacity: '',
                facilities: '',
                login_id : login_id, //아이디값 전달; favorites테이블에서 해당아이디의 roomId 값만 가져오기위함
                
            },
            //dataType:"json",//html, xml, script, json, jsonp, text
            dataType: "json"
        })
        .done((data) => {
            console.log("done", data, "\n");

            //해당강의실 없을경우 안내하기.

            for (let i = 0; i < data["rooms"][0].length; i++) {
                let id = `${data["rooms"][0][i]["roomId"]}`;

                let new_room = document.createElement("div");
                new_room.setAttribute("id", `room_${id}`);
                document.getElementById('rooms_wrapper').appendChild(new_room);

                $(`#room_${id}`).load("/html/favorite.html");
                $(`#room_${id}`).attr("class", "room");
                // event있던자리. setTimeout()안에넣으면 왜 안되지.


                setTimeout(() => {

                    $(`#room_${id} > div:nth-child(1)`).attr("id", `${id}_top`);
                    $(`#room_${id} > div:nth-child(2)`).attr("id", `${id}_bottom`);

                    //top
                    $(`#${id}_top > ol > li`).attr("data-target", `${id}_top`);

                    $(`#${id}_top .carousel-item:nth-child(1) img`).attr("src", `/uploads/${encodeURIComponent(data["rooms"][0][i]["image1"])}`);
                    $(`#${id}_top .carousel-item:nth-child(2) img`).attr("src", `/uploads/${encodeURIComponent(data["rooms"][0][i]["image2"])}`);
                    $(`#${id}_top .carousel-item:nth-child(3) img`).attr("src", `/uploads/${encodeURIComponent(data["rooms"][0][i]["image3"])}`);

                    $(`#${id}_top a`).attr("href", `#${id}_top`);

                    //bottom
                    // 편의시설
                    if (data["rooms"][0][i]["computer"] == 0)
                        $(`#${id}_bottom .fa-desktop`).attr("display", "none");
                    if (data["rooms"][0][i]["projector"] == 0)
                        $(`#${id}_bottom .fa-projector`).attr("display", "none");
                    if (data["rooms"][0][i]["chalkboard"] == 0)
                        $(`#${id}_bottom .fa-chalkboard`).attr("display", "none");
                    if (data["rooms"][0][i]["parking"] == 0)
                        $(`#${id}_bottom .fa-parking`).attr("display", "none");

                    $(`#${id}_bottom .room_tag`).html(`<h3>${building_name[data["rooms"][0][i]["buildingId"]]}  ${data["rooms"][0][i]["roomNo"]}호</h3>`);
                    $(`#${id}_bottom .room_id`).html(`nonon`);


                    // event
                    $(`#room_${id}`).click(popmodal);

                    // 예약시간 선택
                    $(`#${id}_bottom .timetable > div`).click((e) => {
                        if (clicktimes == 0) {

                            e.currentTarget.style.backgroundColor = '#579121';
                            reserve_from = Number(e.currentTarget.childNodes[0].data);

                            clicktimes++;

                        } else if (clicktimes == 1) {

                            e.currentTarget.style.backgroundColor = '#579121';
                            reserve_to = Number(e.currentTarget.childNodes[0].data);

                            if (reserve_from > reserve_to) {
                                let tmp = reserve_from;
                                reserve_to = reserve_from;
                                reserve_to = tmp;
                            }
                            clicktimes++;

                        } else if (clicktimes == 2) {
                            reserve_from = null;
                            reserve_to = null;

                            $(`#${id}_bottom .timetable > div`).css("background-color", "#ffffff");

                            clicktimes = 0;
                        }
                    });



                    
                }, 100);

            }// for (rooms.length);

            for (let i = 0; i < data["reservations"][0].length; i++) {
                let reservation = data["reservations"][0][i];
                let roomId = data["reservations"][0][i].roomId;
                let from = reservation.reserveFrom;
                let to = reservation.reserveTo;

                for (let j = from; j <= to; j++)
                    $(`#${roomId} .timetable td:nth-child(${j})`).attr("background-color", "red");
            }


            currentPage++;


        })
        .fail(function (error) {
            console.log(error);
        })
        .always(function (data) {});

}

function loadmore() {

    checkLogin();

    $.ajax({
            url: 'http://' + host + '/rooms/' + building,
            type: 'GET',
            data: {
                currentPage: currentPage,
                date: date,
                time_from_hours: time_from_hours,
                time_from_minutes: time_from_minutes,
                capacity: '',
                facilities: '',
                building: building,
            },
            //dataType:"json",//html, xml, script, json, jsonp, text
            dataType: "json"
        })
        .done((data) => {
            console.log("done", data, "\n");
            console.log("done", data["rooms"], "\n");

            //해당강의실 없을경우 안내하기.

            for (let i = 0; i < data["rooms"][0].length; i++) {
                let id = `${data["rooms"][0][i]["roomId"]}`;

                let new_room = document.createElement("div");
                new_room.setAttribute("id", `room_${id}`);
                document.getElementById('rooms_wrapper').appendChild(new_room);

                $(`#room_${id}`).load("/html/room.html");
                $(`#room_${id}`).attr("class", "room");
                // event있던자리. setTimeout()안에넣으면 왜 안되지.


                setTimeout(() => {

                    $(`#room_${id} > div:nth-child(1)`).attr("id", `${id}_top`);
                    $(`#room_${id} > div:nth-child(2)`).attr("id", `${id}_bottom`);

                    //top
                    $(`#${id}_top > ol > li`).attr("data-target", `${id}_top`);

                    $(`#${id}_top .carousel-item:nth-child(1) img`).attr("src", `/uploads/${encodeURIComponent(data["rooms"][0][i]["image1"])}`);
                    $(`#${id}_top .carousel-item:nth-child(2) img`).attr("src", `/uploads/${encodeURIComponent(data["rooms"][0][i]["image2"])}`);
                    $(`#${id}_top .carousel-item:nth-child(3) img`).attr("src", `/uploads/${encodeURIComponent(data["rooms"][0][i]["image3"])}`);

                    $(`#${id}_top a`).attr("href", `#${id}_top`);

                    //bottom
                    // 편의시설
                    if (data["rooms"][0][i]["computer"] == 0)
                        $(`#${id}_bottom .fa-desktop`).attr("display", "none");
                    if (data["rooms"][0][i]["projector"] == 0)
                        $(`#${id}_bottom .fa-projector`).attr("display", "none");
                    if (data["rooms"][0][i]["chalkboard"] == 0)
                        $(`#${id}_bottom .fa-chalkboard`).attr("display", "none");
                    if (data["rooms"][0][i]["parking"] == 0)
                        $(`#${id}_bottom .fa-parking`).attr("display", "none");

                    $(`#${id}_bottom .room_tag`).html(`<h3>${building_name[data["rooms"][0][i]["buildingId"]]}  ${data["rooms"][0][i]["roomNo"]}호</h3>`);

                    //건물명 저장용
                    $(`#${id}_bottom .secret_bname`).html(`${building_name[data["rooms"][0][i]["buildingId"]]}`);
                    //강의실명 저장용
                    $(`#${id}_bottom .secret_rname`).html(`${data["rooms"][0][i]["roomId"]}`);



                    // event
                    $(`#room_${id}`).click(popmodal);

                    // 예약시간 선택
                    $(`#${id}_bottom .timetable > div`).click((e) => {
                        if (clicktimes == 0) {

                            e.currentTarget.style.backgroundColor = '#579121';
                            reserve_from = Number(e.currentTarget.childNodes[0].data);

                            clicktimes++;

                        } else if (clicktimes == 1) {

                            e.currentTarget.style.backgroundColor = '#579121';
                            reserve_to = Number(e.currentTarget.childNodes[0].data);

                            if (reserve_from > reserve_to) {
                                let tmp = reserve_from;
                                reserve_to = reserve_from;
                                reserve_to = tmp;
                            }
                            clicktimes++;

                        } else if (clicktimes == 2) {
                            reserve_from = null;
                            reserve_to = null;

                            $(`#${id}_bottom .timetable > div`).css("background-color", "#ffffff");

                            clicktimes = 0;
                        }
                    });

                    
                        
                    //예약 버튼 눌렀을때 이벤트
                    $(`#${id}_bottom .btn_reserve`).click(() => {
                        console.log($(`#${id}_bottom .secret_rname`).html());

                        if (clicktimes != 2) {
                            alert("예약 시간을 선택하세요."); return;
                        }

                        //로그인상태확인
                        $.get("http://" + host + "/checkLogin", {

                        }, function (data) {
                            if (data == "ok") {

                                $.ajax({
                                    url: "http://" + host + "/reserve",
                                    type: 'POST', 
                                    data:{
                                        room_id: $(`#${id}_bottom .secret_rname`).html(),
                                        room_tag : $(`#${id}_bottom .room_tag`).html(),
                                        reserve_date : date,
                                        reserve_from : reserve_from,
                                        reserve_to : reserve_to,    
                                        
                                    },
                                    dataType:'html'
                                })
                                .done((data)=>{
                                    $("#reserve").html(data);
                                })

                            }
                            if (data == "not ok") {

                                alert("로그인 후 이용하여주시기 바랍니다.");
                                $('#reserve').html("");
                                $('#reserve').load("/html/login.html");

                            }
                        });
                    });
                    
                    //즐겨찾기 등록 버튼 눌렀을때 이벤트
                    $(`#${id}_bottom .favorite_btn`).click(() => {

                        //로그인상태확인
                        $.get("http://" + host + "/checkLogin", {

                        }, function (data) {
                            if (data == "ok") {

                                //해당 강의실을 즐겨찾기 목록에 추가함
                                $.get("http://" + host + "/addFavorites", {
                                    //선택한 강의실의 roomId 전달
                                    roomId: $(`#${id}_bottom .secret_rname`).html()
                                }, function (data) {

                                    if (data == "completed")
                                        alert("해당 강의실을 즐겨찾기 목록에 추가하였습니다.");
                                    if (data == "exist")
                                        alert("이미 즐겨찾기로 등록되어있습니다.");

                                });

                            }
                            if (data == "not ok") {

                                alert("로그인 후 이용하여주시기 바랍니다.");
                                window.location.href = "http://" + host + "/my-account";
                            }
                        });
                    });

                }, 100);
            }

            for (let i = 0; i < data["reservations"][0].length; i++) {
                let reservation = data["reservations"][0][i];
                let roomId = data["reservations"][0][i]["roomId"];
                let from = reservation.reserveFrom;
                let to = reservation.reserveTo;

                for (let j = from; j <= to; j++)
                    $(`#${roomId} .timetable div:nth-child(${j})`).attr("background-color", "red");
            }


            currentPage++;


        })
        .fail(function (error) {
            console.log(error);
        })
        .always(function (data) {});
}


// 건물버튼
document.getElementById('loadmore').addEventListener('click', loadmore);
document.getElementById('collegeofengineering1').addEventListener('click', () => {
    currentPage = 1;
    $('#rooms_wrapper').html("");
    building = 4;
    loadmore();
});

document.getElementById('gachonhall').addEventListener('click', () => {
    currentPage = 1;
    $('#rooms_wrapper').html("");
    building = 1;
    loadmore();
});
document.getElementById('collegeofit').addEventListener('click', () => {
    currentPage = 1;
    $('#rooms_wrapper').html("");
    building = 7;
    console.log("it click");
    loadmore();
});
document.getElementById('visiontower').addEventListener('click', () => {
    currentPage = 1;
    $('#rooms_wrapper').html("");
    building = 2;
    loadmore();
});


// modal
$('#background').click(() => {
    $('#background, #reserve, .btn_reserve, .favorite_btn').toggle();
    $('#reserve').html("");
});


function popmodal(e) {
    $('#reserve').html("");
    console.log(e);
    let clone = $(e.currentTarget).clone(true);
    //e.currentTarget Id저장해놓고

    clone.appendTo('#reserve');
    $('#background, #reserve, .btn_reserve, .favorite_btn').toggle();

    $('#reserve > div').attr("id", "room_reserve");
    $('#reserve > .room > .carousel').attr("id", 'reserve_top');
    $('#reserve_top > ol > li').attr("data-target", '#reserve_top');
    $(`#reserve_top > a`).attr("href", `#reserve_top`);
    $(`#room_reserve`).off("click");

}

// ~modal

// 예약
function reserve(room_id) {
    console.log('reserve()');
    $.ajax({
            url: 'http://' + host + '/reserve/',
            type: 'POST',
            data: {
                room_id: room_id,
                reserve_date: date,
                reserve_from: reserve_from,
                reserve_to: reserve_to,
            },
            //dataType:"json",//html, xml, script, json, jsonp, text
            dataType: "html"
        })
        .done((data) => {

            $('#reserve').html("");
            $('#reserve').html(`${data}`);

        })
        .fail(function (error) {

            console.log(error);

        })
        .always(function (data) {

        });


}
