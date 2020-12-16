let doctors = [];
let patients = [];
let tests = [];

class User {
  constructor(firstName, lastName) {
    if (this.constructor === User) {
      throw new Error("Non instantiable class");
    }
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class Doctor extends User {
  constructor(firstName, lastName, specialization) {
    super(firstName, lastName);
    this.id = Doctor.incrementId();
    this.specialization = specialization;
    doctors.push(this);
    Logger.createDoctor(this);
  }

  scheduleLaboratoryTest(patient, date, time, type) {
    if (type === "BP") {
      let test = new BloodPressure(date, time, patient);
      //patient.tests.push(test);
      return test;
    } else if (type === "BSL") {
      let test = new BloodSugarLevel(date, time, patient);
      //patient.tests.push(test);
      return test;
    } else if (type === "BCL") {
      let test = new BloodCholesterolLevel(date, time, patient);
      //patient.tests.push(test);
      return test;
    } else {
      throw new Error("This type of test does not exist");
    }
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
}

class Patient extends User {
  constructor(
    firstName,
    lastName,
    uniqueIdentificationNumber,
    healthCardNumber
  ) {
    super(firstName, lastName);
    this.id = Patient.incrementId();
    this.uniqueIdentificationNumber = uniqueIdentificationNumber;
    this.healthCardNumber = healthCardNumber;
    this.doctor = null;
    patients.push(this);
    Logger.createPatient(this);
  }

  chooseDoctor(doctor) {
    if (this.doctor !== null) {
      throw new Error("You already have a doctor");
    }
    this.doctor = doctor;
    Logger.patientChoosesDoctor(this, doctor);
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
}

class LaboratoryTest {
  constructor(date, time, patient) {
    if (this.constructor === LaboratoryTest) {
      throw new Error("Non instantiable class");
    }
    this.id = LaboratoryTest.incrementId();
    this.date = date;
    this.time = time;
    this.patient = patient;
  }

  doTest() {
    throw new Error("method doTest() not implemented");
  }

  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
}

class BloodPressure extends LaboratoryTest {
  constructor(date, time, patient) {
    super(date, time, patient);
    this.type = "Krvni pritisak";
    this.upperValue = null;
    this.lowerValue = null;
    this.pulse = null;
    tests.push(this);
  }

  doTest() {
    this.upperValue = Math.floor(Math.random() * (180 - 70) + 70);
    this.lowerValue = this.upperValue - Math.floor(Math.random() * (60 - 30) + 30);
    this.pulse = this.pulse = Math.floor(Math.random() * (140 - 50) + 50);
    const results = `Gornji: ${this.upperValue}\n Donji: ${this.lowerValue}\n Pulse: ${this.pulse}`;
    Logger.laboratoryTest('krvni pritisak', this.patient, results);
  }
}

class BloodSugarLevel extends LaboratoryTest {
  constructor(date, time, patient) {
    super(date, time, patient);
    this.type = "Nivo secera u krvi";
    this.value = null;
    this.lastMealTime = null;
    tests.push(this);
  }

  doTest() {
    this.value = (Math.random() * (25 - 3) + 3).toFixed(2);
    this.lastMealTime = `${Math.floor(Math.random() * (12 - 1) + 1)} hours ago`;
    const results = `Vrednost: ${this.value}\n Vreme poslednjeg obroka: ${this.lastMealTime}`;
    Logger.laboratoryTest("nivo secera u krvi", this.patient, results);
  }
}

class BloodCholesterolLevel extends LaboratoryTest {
  constructor(date, time, patient) {
    super(date, time, patient);
    this.type = "Nivo holesterola u krvi";
    this.value = null;
    this.lastMealTime = null;
    tests.push(this);
  }

  doTest() {
    this.value = (Math.random() * (10 - 4) + 4).toFixed(2);
    this.lastMealTime = `${Math.floor(Math.random() * (12 - 1) + 1)} hours ago`;
    const results = `Vrednost: ${this.value}\n Vreme poslednjeg obroka: ${this.lastMealTime}`;
    Logger.laboratoryTest("nivo holesterola u krvi", this.patient, results);
  }
}

class Logger {
  static createDoctor(doctor) {
    console.log(`${Logger.getCurrentDate()} Kreiran doktor ${doctor.firstName} ${doctor.lastName}`);
  }

  static createPatient(patient) {
    console.log(`${Logger.getCurrentDate()} Kreiran pacijent ${patient.firstName} ${patient.lastName}`);
  }

  static patientChoosesDoctor(patient, doctor) {
    console.log(`${Logger.getCurrentDate()} Izabran doktor ${doctor.firstName} ${doctor.lastName}, od strane pacijenta ${patient.firstName} ${patient.lastName}`);
  }

  static laboratoryTest(test, patient, results) {
    console.log(`${Logger.getCurrentDate()} Odradjen pregled za ${test} za pacijenta ${patient.firstName} ${patient.lastName}.Rezultati:\n ${results}`);
  }

  static getCurrentDate() {
    const date = new Date();
    return `[${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}]`;
  }
}