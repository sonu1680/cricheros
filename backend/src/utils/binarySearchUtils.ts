export const binarySearchRange = (
  low: number,
  high: number,
  simulateFn: (mid: number) => { position: number; nrr: number },
  desiredPosition: number
) => {
  let minValue: number | null = null;
  let maxValue: number | null = null;
  let minNRR: number | null = null;
  let maxNRR: number | null = null;

  // find min
  let l = low,
    h = high;
  while (l <= h) {
    const mid = Math.floor((l + h) / 2);
    const { position, nrr } = simulateFn(mid);
    if (position === desiredPosition) {
      minValue = mid;
      minNRR = nrr;
      h = mid - 1;
    } else if (position > desiredPosition) h = mid - 1;
    else l = mid + 1;
  }

  // find max
  l = low;
  h = high;
  while (l <= h) {
    const mid = Math.floor((l + h) / 2);
    const { position, nrr } = simulateFn(mid);
    if (position === desiredPosition) {
      maxValue = mid;
      maxNRR = nrr;
      l = mid + 1;
    } else if (position > desiredPosition) h = mid - 1;
    else l = mid + 1;
  }



  return { minValue, maxValue, minNRR, maxNRR };
};
