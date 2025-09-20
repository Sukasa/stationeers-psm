# SPSM PROJECT - AAC ALARM ANNUCIATOR CHIP
# Revision: 2025-09-19
# Variant: Stack-Driven
# Timing: 2 init + 5/loop + 4/alarm
# Format: n: RefrenceId (53)
# Annunciates ALARM STATE values from an ASC to up to 30 DISPLAY UNITS, by setting their `On` LogicType values
# Stores ReferenceId values of DISPLAY UNITS in stack memory starting from Stack addresses 30..1

  alias ASC d0
  move r0 0
  move r2 1
  
start:
  yield
  seqz r1 r1
  move sp 31
  pop r15
  
loop:
  get r13 d0 sp
  s r15 On rr13
  pop r15
  bgtz r15 loop
  j start