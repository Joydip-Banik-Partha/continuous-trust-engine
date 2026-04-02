export function computeTrust(currentTrust, drift) {
  let newTrust = currentTrust - drift;

  // Recovery window for normal behavior
  if (drift === 0 && newTrust < 0.9) {
    newTrust += 0.02;
  }

  if (newTrust > 1) newTrust = 1;
  if (newTrust < 0) newTrust = 0;

  return newTrust;
}