## Module Contracts

### trust-signals/*
Produces raw, passive signals.
No risk logic. No decisions.

Output (example):
{
  signalId,
  value,
  confidence,
  timestamp
}

### trust-model/*
Consumes signals, produces trust score.

Input:
- signal stream
- prior baseline
- time window

Output:
{
  trustScore: number (0.0 – 1.0),
  driftScore,
  factors[]
}

### decision-engine/*
Stateless policy evaluation.

Input:
{
  trustScore,
  context
}

Output:
{
  tier,
  action
}

### enforcement/*
Applies actions silently.

Input:
{
  action,
  session
}

Effect:
- capability reduction
- TTL shortening
- soft limits

### audit/*
Write-only.
Never mutates decisions.