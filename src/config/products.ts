export const PRODUCT_PRICE = {
  material: {
    silicone: 0,
    polycarbonate: 5_00, // 1_000_000 -> life hack to ease long number
  },
  finish: {
    smooth: 0,
    texture: 3_00,
  },
} as const;
export const BASE_PRICE = 14_00;
