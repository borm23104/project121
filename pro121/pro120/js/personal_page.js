$(document).ready(load_reservations());

function load_reservations(){
    $.ajax({
        url:'http://localhost/reserve',
        type:'GET',
        data:{
          
        },
        //dataType:"json",//html, xml, script, json, jsonp, text
        dataType:"json"
      })
      .done((data)=>{
        console.log(data);

        for(let i=0; i< data[0].length; i++){


            let new_reservation = document.createElement('div');
            let id = `${data[0][i]['reservationId']}`;
            new_reservation.setAttribute("id", `reservation_${id}`);
            new_reservation.setAttribute("class", "reservation");

            $('#reservations_wrapper').append(new_reservation);

            $(`#reservation_${id}`).load("/html/mypage_reservations.html");

            setTimeout( function(){

              
              let from = data[0][i]['reserveFrom']%2==0? ( 8+data[0][i]['reserveFrom']/2 + ':00') : ( 8 + Math.floor(data[0][i]['reserveFrom']/2) + ':30' );
              let to = data[0][i]['reserveTo']%2==0? ( 8+data[0][i]['reserveTo']/2 + ':00') : ( 8 + Math.floor(data[0][i]['reserveTo']/2) + ':30' );

              $(`#reservation_${id} .reservation_id`).html(`${data[0][i]['reservationId']}`);
              $(`#reservation_${id} .reservation_date`).html(`${data[0][i]['reserveDate']}`);
              $(`#reservation_${id} .reservation_time`).html(`${from} ~ ${to}`);
              $(`#reservation_${id} .reservation_room`).html(`${data[0][i]['roomId']}`);
              
              //date지났으면 취소버튼 비활성화

            }, 100);


        }


      })
      .fail((err)=>{
          console.log("error occured", err);
      })
      .always((data)=>{

      })
}


//예약 취소버튼
$(".cancel_reservation").click( (e)=>{


  console.log(e.currentTarget);

  $.ajax({
    url:'http://localhost/reserve/cancel',
    type:'POST',
    data:{

      reservation_id: e.currentTarget,

    },
    
    dataType:"html"
  })
  .done((data)=>{

      alert("예약을 취소했습니다.");
      load_reservations();

  })
  .fail((err)=>{

      alert("예약을 취소할 수 없습니다. 새로고침 후 다시 이용해 주세요.");

  })
  .always((data)=>{

  })

})