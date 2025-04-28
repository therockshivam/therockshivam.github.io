// var param;
// param = ;
// GJ06HF9607
function getData(param) {
    const data = JSON.stringify({
        "task_id": "74f4c926-250c-43ca-9c5e3-453t87ceacd1",
        "group_id": "8e16424a-58fc-4ba5-ab2e0-5bc8e7c3c41e",
        "data": {
            "rc_number": param
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            var dt=JSON.parse(this.responseText)
            console.log(dt);
            // document.write(this.responseText);

    console.log(dt.result.extraction_output.owner_name);
document.getElementById('value1').innerText=dt.action;
document.getElementById('value2').innerText=dt.completed_at;

document.getElementById('value3').innerText=dt.created_at
;
document.getElementById('value4').innerText=dt.group_id;
document.getElementById('value5').innerText=dt.request_id;
document.getElementById('value6').innerText=dt.result.extraction_output.chassis_number;
document.getElementById('value7').innerText=dt.result.extraction_output.colour;
document.getElementById('value8').innerText=dt.result.extraction_output.cubic_capacity;
document.getElementById('value9').innerText=dt.result.extraction_output.current_address;
document.getElementById('value10').innerText=dt.result.extraction_output.engine_number ;
document.getElementById('value11').innerText=dt.result.extraction_output.fitness_upto ;
document.getElementById('value12').innerText=dt.result.extraction_output.fuel_type ;
document.getElementById('value13').innerText=dt.result.extraction_output.insurance_name;
document.getElementById('value14').innerText=dt.result.extraction_output.insurance_policy_no ;
document.getElementById('value15').innerText=dt.result.extraction_output.insurance_validity ;
document.getElementById('value16').innerText=dt.result.extraction_output.manufacturer  ;
document.getElementById('value17').innerText=dt.result.extraction_output.mv_tax_upto ;
document.getElementById('value18').innerText=dt.result.extraction_output.norms_type ;
document.getElementById('value19').innerText=dt.result.extraction_output.owner_name ;
document.getElementById('value20').innerText=dt.result.extraction_output.owner_serial_number ;
document.getElementById('value22').innerText=dt.result.extraction_output.permit_issue_date ;
document.getElementById('value23').innerText=dt.result.extraction_output.permit_validity_from;
document.getElementById('value24').innerText=dt.result.extraction_output.puc_valid_upto;
document.getElementById('value25').innerText=dt.result.extraction_output.registered_place;
document.getElementById('value26').innerText=dt.result.extraction_output.registration_date;
document.getElementById('value27').innerText=dt.result.extraction_output.registration_number;
document.getElementById('value28').innerText=dt.result.extraction_output.status;
document.getElementById('value29').innerText=dt.result.extraction_output.status_verfy_date;
document.getElementById('value30').innerText=dt.result.extraction_output.status_verification;
document.getElementById('value31').innerText=dt.result.extraction_output.unladden_weight;
document.getElementById('value32').innerText=dt.result.extraction_output.vehicle_category;
document.getElementById('value33').innerText=dt.result.extraction_output.vehicle_class;

        }
    });

    xhr.open("POST", "https://rc-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_rc_plus");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("X-RapidAPI-Key", "783c8e21b2msh39ac9dc22b315b4p1a5b81jsnc2fd4650956a");
    xhr.setRequestHeader("X-RapidAPI-Host", "rc-verification.p.rapidapi.com");

    xhr.send(data);
};


    // Load the footer dynamically
    function getFooter(location) {
        fetch(location)
          .then(response => response.text())
          .then(data => {
            document.getElementById('footer').innerHTML = data;
          });
      }

       // Load the header dynamically
    function getNavbar(location) {
        fetch(location)
          .then(response => response.text())
          .then(data => {
            document.getElementById('navbar').innerHTML = data;
          });
      }
  
  
  
      getNavbar('../../components/common/navbar.html');
      getFooter('../../components/common/footer.html');

