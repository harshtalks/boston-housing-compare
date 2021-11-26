export const determineMeanAndSTD = (data) => {
  const mean = data.mean(0);

  const diffFromMean = data.sub(mean);

  const squaredDiffFromMean = diffFromMean.square();

  const variance = squaredDiffFromMean.mean(0);

  const std = variance.sqrt();

  return { mean, std };
};

export const normalizedData = (data, mean, std) => {
  const zScoreData = data.sub(mean).div(std);

  return zScoreData;
};
