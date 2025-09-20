# SPSM PROJECT - SDC STACK DATA CHIP
# Revision: 2025-09-19
# Variant: Stack-Driven
# Timing: 2/loop + 14/block + 6/transfer
# Format: n: DestDev (3b) | DestAdddress (14b) | SrcDev (3b) | SrcAddress (14b) | Len-1 (8b), from address 511 down
# Performs configurable block data transfer operations between STACK UNIT devices
# Maps d0 through d5 as contiguous 8192 Double blocks
# Transfer blocks max out at 256 (Len + 1) doubles transferred per block

start:
  yield
  move sp 512
  
next:
  pop r0
  beqz r0 start
  and r1 r0 255   # r1 = Len
  srl r2 r0 8
  and r2 r2 8191  # r2 = SrcAddr
  srl r3 r0 22
  and r3 r3 7     # r3 = SrcDev
  srl r4 r0 25
  and r4 r4 8191  # r4 = DestAddr
  srl r5 r0 39
  and r5 r5 7     # r5 = DstDev
  bdns dr3 next
  bdns dr5 next
  
xfer:
  get r0 dr3 r2
  put dr5 r4 r0
  add r4 r4 1
  add r2 r2 1
  sub r1 r1 1
  bgez r1 xfer
  j next