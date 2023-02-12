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
      .forEach((field, index) => {
        if (index < 2 && !field.includes('-') && !field.includes('/')) {
          switch (index) {
            case 0:
              dogData.name = field;
              break;
            case 1:
              dogData.breed = field;
              break;
          }
        } 
        else if(field.includes('-') || field.includes('Female')|| field.includes('Male')){
            const [gender, age] = field.split(' - ');
              dogData.gender = gender;
              dogData.age = age;
        }
        else if(field.includes('/')){
            let randomNumber = Math.floor(Math.random() * 2);
            if (randomNumber === 0) {
                dogData.spayNeuter = "Spayed";
            } else {
                dogData.spayNeuter = "Neutered";
            }
        }
        else {
          const [key, value] = field.split(': ');
          switch (key) {
            case "Animal ID":
              dogData.animalId = value;
              break;
            case "Vaccination status":
              dogData.vaccinationStatus = value;
              break;
            case "Location":
              dogData.location = value;
              break;
            case "Available for adoption":
              dogData.availableForAdoption = value;
              break;
            case "Type":
              dogData.type = value;
              break;
            case "Additional details":
              dogData.additionalDetails = value;
              break;
          }
        }
      });
    return dogData;
  });
  return dogs;
//   return JSON.stringify(dogs, null, 2);
};
function addPictures(filePath, dogs) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        let links = data.split("\r\n");
        dogs.forEach((dog, index) => {
          dog.pic1 = links[index * 3];
          dog.pic2 = links[index * 3 + 1];
          dog.pic3 = links[index * 3 + 2];
        });
        resolve(JSON.stringify(dogs, null, 2));
      });
    });
  }
  

readFile('data.txt')
  .then(data => processData(data))
  .then(dogs => addPictures("pictures.txt",dogs))
  .then(output => writeFile('output.json', output))
  .then(() => console.log('JSON file generated successfully!'))
  .catch(err => console.error(err));
