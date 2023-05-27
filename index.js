const fs = require("fs");

function readCSVFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data);
    });
  });
}

function sumLinesByState(csvData) {
  const lines = csvData.split("\n");
  const header = lines[0].split(",");
  const stateIndex = header.indexOf("state");
  const stateCount = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      continue;
    }

    const values = line.split(",");
    const state = values[stateIndex];
    stateCount[state] = (stateCount[state] || 0) + 1;
  }

  const result = [];
  for (const state in stateCount) {
    result.push({ state, total: stateCount[state] });
  }

  return result;
}

const dataToCSV = (data) => {
  return data.reduce((acc, data) => {
    acc += `${data.state}, ${data.total}`;
    return acc;
  }, `state, total`);
};

readCSVFile()
  .then((csvData) => {
    const stateCount = sumLinesByState(csvData);
    const newCSV = dataToCSV(stateCount);

    fs.writeFile("police_killings.csv", newCSV, (error) => {
      if (error) {
        console.error("Erro ao escrever o arquivo CSV:", error);
        return;
      }

      console.log("Arquivo CSV escrito com sucesso!");
    });
  })
  .catch((error) => {
    console.error("Erro ao ler o arquivo CSV:", error);
  });
