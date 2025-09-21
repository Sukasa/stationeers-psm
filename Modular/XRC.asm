# SPSM PROJECT - XRC INTERRUPT ROUTER CHIP
# Revision: 2025-09-19
# Variant: Stack-Driven
# Timing: 4/loop + 8/mapping
# Format: n: ReferenceID (53), n-1: Write Value (29) | Destination (14)
# Location: 49..1
# Performs condition transfers from device Setting value to STACK UNIT
# Only transfers non-zero values, relies on PLC or ASP to clear Zone RAM value
# XRC can process 15-24 inputs per tick depending on how many are nonzero
# The ideal loading is 22 buttons, on the assumption that at most two buttons will be activated on the same tick

  alias STACK_UNIT d0

start:
  yield
  move sp 50
  pop r0
  
loop:
  pop r1
  l r2 r0 Setting
  beqz r2 next
  srl r4 r1 13
  and r1 r1 8191
  put d0 r1 r4
next:
  pop r0
  bdse r0 loop
  j start