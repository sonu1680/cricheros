import { binarySearchRange } from "../utils/binarySearchUtils";

describe("binarySearchRange", () => {
  const simulateFn = (score: number) => ({
    position: score < 50 ? 3 : 1,
    nrr: score / 100,
  });

  it("should find min and max values for the desired position", () => {
    const { minValue, maxValue, minNRR, maxNRR } = binarySearchRange(
      0,
      100,
      simulateFn,
      1
    );

    expect(minValue).toBeGreaterThanOrEqual(50);
    expect(maxValue).toBeGreaterThanOrEqual(50);

    expect(minNRR).toBe(minValue! / 100);
    expect(maxNRR).toBe(maxValue! / 100);
  });

  it("should return null if desired position never occurs", () => {
    const { minValue, maxValue, minNRR, maxNRR } = binarySearchRange(
      0,
      49,
      simulateFn,
      1
    );

    expect(minValue).toBeNull();
    expect(maxValue).toBeNull();
    expect(minNRR).toBeNull();
    expect(maxNRR).toBeNull();
  });

  it("should work when the entire range matches desired position", () => {
    const fullMatchFn = (score: number) => ({ position: 1, nrr: score / 100 });
    const { minValue, maxValue } = binarySearchRange(0, 10, fullMatchFn, 1);

    expect(minValue).toBe(0);
    expect(maxValue).toBe(10);
  });

  it("should handle single-element range", () => {
    const singleFn = (score: number) => ({
      position: score === 5 ? 1 : 2,
      nrr: score / 100,
    });
    const { minValue, maxValue } = binarySearchRange(5, 5, singleFn, 1);

    expect(minValue).toBe(5);
    expect(maxValue).toBe(5);
  });
});
