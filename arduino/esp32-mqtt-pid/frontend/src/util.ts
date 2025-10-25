export const getTime = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
};

export const awaitDelay = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const downloadCsv = (data: object[]) => {
  // prepare data
  const rows: any[] = [];

  const headerRow: any[] = [];
  const keys = Object.keys(data[0]);
  keys.forEach((key) => headerRow.push(key));
  rows.push(headerRow);

  for (const dataPoint of data) {
    const row = [];
    for (const [key, value] of Object.entries(dataPoint)) {
      row.push(value);
    }
    rows.push(row);
  }

  // create csv
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  // download csv
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "pwm-velocity-analysis.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the data file named "my_data.csv".
};
