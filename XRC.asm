# SPSM PROJECT - XRC INTERRUPT ROUTER CHIP
# Revision: 2025-09-19
# Variant: Stack-Driven
# Timing: 4/loop + 6/mapping
# Format: n: ReferenceID (53), n-1: Destination (53)
# Performs condition transfers from device Setting value to STACK UNIT
# Only transfers non-zero values, relies on PLC or ASP to clear Zone RAM value
# XRC can process 20-24 inputs per tick depending on how many are nonzero

alias STACK_UNIT d0

  define Type Setting

start:
  yield
  move sp 512
  pop r0
  
loop:
  pop r1
  l r2 r0 Type
  beqz r3 next
  set d0 r1 r3
next:
  pop r0
  bdse r0 loop
  j start