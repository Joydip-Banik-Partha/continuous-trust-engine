export function temporalDecay(trustScore, lastActive) {
  const secondsIdle = (Date.now() - lastActive) / 1000;

  if (secondsIdle < 5) {
    return trustScore; // no decay during active use
  }

  if (secondsIdle < 30) {
    return trustScore * 0.98;
  }

  return trustScore * 0.95;
}