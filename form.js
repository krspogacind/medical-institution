$(document).ready(function () {
  doctors.forEach(doctor => {
    $('#doctorTable').append('<tr><td>'+ doctor.firstName + '</td><td>'+ doctor.lastName +'</td><td>'
    + doctor.specialization +'</td></tr>');
  });
  
  patients.forEach(patient => {
    $('#patientTable').append('<tr><td>'+ patient.firstName + '</td><td>'+ patient.lastName +'</td><td>'
    + patient.uniqueIdentificationNumber +'</td><td>' + patient.healthCardNumber + '</td><td>'
    + patient.doctor.firstName + ' ' + patient.doctor.lastName + '</td></tr>');
    $('#patient').append(new Option(patient.firstName + ' ' + patient.lastName, JSON.stringify(patient)));
  });

  tests.forEach(test => {
    if (test.type === 'Krvni pritisak'){
      $('#testTable').append('<tr><td>'+ test.date + '</td><td>'+ test.time +'</td><td>'
      + test.type +'</td><td>' + test.patient.firstName + ' ' + test.patient.lastName + '</td><td>'
      + 'Gornji: ' + test.upperValue + ' Donji: ' + test.lowerValue + ' Puls: ' + test.pulse + '</td></tr>');
    } else if(test.type === 'Nivo secera u krvi' || test.type === 'Nivo holesterola u krvi'){
      $('#testTable').append('<tr><td>'+ test.date + '</td><td>'+ test.time +'</td><td>'
      + test.type +'</td><td>' + test.patient.firstName + ' ' + test.patient.lastName + '</td><td>'
      + 'Vrednost: ' + test.value + ' Vreme poslednjeg obroka: ' + test.lastMealTime + '</td></tr>');
    } else {
      alert('Wrong test type');
    }
  });
});

function addDoctor(e) {
  e.preventDefault();
  const data = $("#doctorForm").serializeArray();
  const firstNameElement = data.find(element => element.name === 'firstName');
  const lastNameElement = data.find(element => element.name === 'lastName');
  const specializationElement = data.find(element => element.name === 'specialization');
  let doctor = new Doctor(firstNameElement.value, lastNameElement.value, specializationElement.value);
  $('#doctorTable').append('<tr><td>'+ firstNameElement.value + '</td><td>'+ lastNameElement.value +'</td><td>'
  + specializationElement.value +'</td></tr>');
}

function chooseDoctor(id) {
  let newPatient;
  patients.forEach(patient => {
    if (patient.id === id){
      newPatient = patient;
    }
  });
  let JSONDoctor = JSON.parse($(`#${id}`).val());
  let selectedDoctor;
  doctors.forEach(doctor => {
    if (doctor.id === JSONDoctor.id){
      selectedDoctor = doctor;
    }
  });
  newPatient.chooseDoctor(selectedDoctor);
  $(`#doktor${id}`).html(`${selectedDoctor.firstName} ${selectedDoctor.lastName}`);
}

function addPatient(e) {
  e.preventDefault();
  const data = $('#patientForm').serializeArray();
  const firstNameElement = data.find(element => element.name === 'firstName');
  const lastNameElement = data.find(element => element.name === 'lastName');
  const uniqueIdentificationNumber = data.find(element => element.name === 'uin');
  const healthCardNumber = data.find(element => element.name === 'hcn');
  const patient = patients.find(patient => patient.uniqueIdentificationNumber === uniqueIdentificationNumber.value);
  if (patient !== undefined){
    alert('Pacijent sa ovim JMBG-om vec postoji');
    return;
  }
  const newPatient = new Patient(firstNameElement.value, lastNameElement.value, uniqueIdentificationNumber.value, healthCardNumber.value);
  $('#patientTable').append('<tr><td>'+ firstNameElement.value + '</td><td>'+ lastNameElement.value +'</td><td>'
  + uniqueIdentificationNumber.value +'</td><td>' + healthCardNumber.value + 
  `</td><td id="doktor${newPatient.id}"><select class="table_select" id="${newPatient.id}"><select><button onClick="chooseDoctor(${newPatient.id})">Select</button></td></tr>`);
  doctors.forEach(doctor => {
    $(`#${newPatient.id}`).append(new Option(doctor.firstName + ' ' + doctor.lastName, JSON.stringify(doctor)));
  });
  $('#patient').append(new Option(newPatient.firstName + ' ' + newPatient.lastName, JSON.stringify(newPatient)));
}

function doTest(id){
  let doTest;
  tests.forEach(test => {
    if (test.id === id){
      doTest = test;
    }
  });
  doTest.doTest();
  if (doTest.type === 'Krvni pritisak'){
    $(`#test${id}`).html('Gornji: ' + doTest.upperValue + ' Donji: ' + doTest.lowerValue + ' Puls: ' + doTest.pulse);
  }else if(doTest.type === 'Nivo secera u krvi' || doTest.type === 'Nivo holesterola u krvi'){
    $(`#test${id}`).html('Vrednost: ' + doTest.value + ' Vreme poslednjeg obroka: ' + doTest.lastMealTime);
  }
}

function addTest(e) {
  e.preventDefault();
  const data = $("#testForm").serializeArray();
  const patientElement = data.find(element => element.name === 'patient');
  const dateElement = data.find(element => element.name === 'testDate');
  const timeElement = data.find(element => element.name === 'testTime');
  const typeElement = data.find(element => element.name === 'type');
  if (patientElement.value === ""){
    alert('You must choose patient');
    return;
  }
  if (typeElement.value === ""){
    alert('You must choose type');
    return;
  }
  const patient = JSON.parse(patientElement.value);
  const newTest = doctors[0].scheduleLaboratoryTest(patient, dateElement.value, timeElement.value, typeElement.value);
  $('#testTable').append('<tr><td>'+ newTest.date + '</td><td>'+ newTest.time +'</td><td>'
  + newTest.type +'</td><td>' + newTest.patient.firstName + ' ' + newTest.patient.lastName + 
  `</td><td id="test${newTest.id}"><button onClick="doTest(${newTest.id})">Do test</button></td></tr>`);
}
