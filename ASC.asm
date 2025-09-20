# SPSM PROJECT - ASC ALARM STATE CONTROL
# Revision: 2025-09-19
# Variant: Stack-Driven w/ Aggregate, Shared ACK
# Timing: 3-Tick Fixed
# Format: n: RAM Address (14)
# Reads a configurable set of in-alarm flags from a connected STACK UNIT, pushing back NORMAL/UNACK/ACKED state values to the same stack addresses
# Reads the Alarm Reset signal from the STACK UNIT and clears it after resetting.  Updates its own `Setting` with alarm statistics every full cycle through its alarm list
# Scans up to 30 alarms at a fixed 0.67 Hz update rate.  Uses ACK handler that allows for multiple ASPs to share one ACK flag without contention
# Provides an AAC-compatible value store in Stack 1-30 to match AAC chip

  alias STACK_UNIT d0
  define ACKADDR 1

  poke 25 -1 # End of list sentinel value

start:
  yield
  
go:
  move sp 61
  move r3 30
  mul r6 r1 1000
  add r6 r6 r0
  mul r7 r2 1000000
  add r6 r6 r7
  s db Setting r6
  get r6 d0 ACKADDR
  snez r6 r6
  or r7 r5 r6
  bneq r7 3 noclear
  put d0 ACKADDR 0
  move r6 0

noclear:
  select r5 r6 2 0
  yield
  pop r6            # Pre-pop first entry to enable cycle optimization in loop
  
loop:
  get r1 d0 r6      # Read Zone RAM state
  max r4 r1 r5      # Set to Acknowledged if ACK flag set.  If the ALARM STATE is somehow not 0-2, this will almost certainly cause ASP state corruption or crash.
  select r4 r1 r4 0 # Set back to 0 if original alarm NORMAL, else (UNACK/ALARM) based on original value from zone ram
  poke r3 r4        # poke to own stack for AAC
  put d0 r6 r4      # put to zone RAM
  add rr4 rr4 1     # Stats aggregate
  sub r3 r3 1       # Decrement stack ram index pointer
  pop r6            # Cycle optimization: no forced jump at end of hot loop
  bgez r6 loop      # Negative RAM address == end of list, zero/positive = continue loop
  ble sp 33 go      # If we took long enough to take 3 ticks, don't extra-yield
  ble sp 47 start   # If we took long enough to take 2 ticks, extra yield once
  yield             # Otherwise extra-yield *twice* to stay at 0.67Hz
  j start           # (the second yield is at start)