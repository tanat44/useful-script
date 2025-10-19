let target: number = 0;
let count: number = 0;
let isOver: boolean | undefined = undefined;

export const updateSetPos = (value: number) => {
  target = value;
  count = 0;
  isOver = undefined;
};

export const updateRawPosition = (value: number) => {
  if (isOver === undefined) {
    isOver = value > target;
    return;
  }

  if (value > target && !isOver) {
    ++count;
    isOver = true;
  } else if (value < target && isOver) {
    ++count;
    isOver = false;
  }
  const dom = document.getElementById("oscillationCount");
  dom.innerText = count.toString();
};
