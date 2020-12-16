let doctor = new Doctor("Milan", "Markovic", "anestesiology");
let patient = new Patient("Dragan", "Petrovic", "1212992800212", "12345678901");
patient.chooseDoctor(doctor);
let test1 = doctor.scheduleLaboratoryTest(
  patient,
  "20.12.2020.",
  "15:00",
  "BSL"
);
let test2 = doctor.scheduleLaboratoryTest(
  patient,
  "25.12.2020.",
  "12:00",
  "BP"
);
test1.doTest();
test2.doTest();