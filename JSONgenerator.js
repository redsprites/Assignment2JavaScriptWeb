const fs = require('fs');

const readFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFile = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, 'utf-8', err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const processData = (data) => {
  const dogs = data.split('* * *\r\n').map(dog => {
    const dogData = {};
    dog
      .split('\r\n')
      .filter(field => field !== "")
      .forEach(field => {
        const [key, value] = field.split(': ');
        switch (key) {
          case "Name":
            dogData.name = value;
            break;
          case "Breed":
            dogData.breed = value;
            break;
          case "Spay/Neuter":
            dogData.spayNeuter = value;
            break;
          case "Age":
            if (value.includes('-')) {
              const [gender, age] = value.split(' - ');
              dogData.gender = gender;
              dogData.age = age;
            } else {
              dogData.age = value;
            }
            break;
          case "Animal ID":
            dogData.animalId = value;
            break;
          case "Vaccination Status":
            dogData.vaccinationStatus = value;
            break;
          case "Location":
            dogData.location = value;
            break;
          case "Available for Adoption":
            dogData.availableForAdoption = value;
            break;
          case "Type":
            dogData.type = value;
            break;
          case "Additional Details":
            dogData.additionalDetails = value;
            break;
        }
      });
    return dogData;
  });
  return JSON.stringify(dogs, null, 2);
};

readFile('data.txt')
  .then(data => processData(data))
  .then(output => writeFile('output.json', output))
  .then(() => console.log('JSON file generated successfully!'))
  .catch(err => console.error(err));