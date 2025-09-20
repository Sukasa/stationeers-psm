# SPSM PROJECT - IRC I/O ROUTER CHIP
# Revision: 2025-09-19
# Variant: Stack-Driven
# Timing: 2/loop + 15/mapping
# Format: n: Dir (1) | SlotOpt (2) | RefId (27) | LogicType (9) | Address (14)
# Performs configurable device-setting input/output from connected STACK UNIT (nominally ZONE RAM)
# Supports reading from slots 0-2, encoded as SlotOpt 1-3


alias STACK_UNIT d0

start:
  yield
  move sp 512
loop:
  pop r0
  and r1 r0 8191      # r1 = RAM Address
  srl r2 r0 14
  and r2 r2 511       # r2 = LogicType
  srl r3 r0 23
  and r3 r3 536870911 # r3 = ReferenceId
  srl r4 r0 50
  and r4 r4 3         # r4 = Slot + 1 (0 == base device)
  srl r0 r0 52        # r0 = /RW
  bnez r4 slot
  bnez r0 write
  l r0 r3 r2
  put RAM r1 r0
  j loop
write:
  get r0 RAM r1
  s r3 r2 r0
  j loop
slot:
  sub r4 r4 1
  bnez r0 swrite
  ls r0 r3 r4 r2
  put RAM r1 r0
  j loop
swrite:
  get r0 RAM r1
  ss r3 r4 r2 r0
  j loop