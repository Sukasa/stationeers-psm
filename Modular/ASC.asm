# SPSM PROJECT - ASC ALARM STATE CONTROL
# Revision: 2025-09-19
# Variant: Stack-Driven w/ Aggregate, Shared ACK
# Timing: 10 AS/tick, 3 ticks/cycle
# Format: n: RAM Address (13)
# Reads a configurable set of in-alarm flags from a connected STACK UNIT, pushing back NORMAL/UNACK/ACKED state values to the same stack addresses
# Reads the Alarm Reset signal from the STACK UNIT and clears it after resetting.  Updates its own `Setting` with alarm statistics every full cycle through its alarm list
# Scans up to 30 alarms at a fixed 0.67 Hz update rate.  Uses ACK handler that allows for multiple ASPs to share one ACK flag without contention
# Provides an AAC-compatible value store in Stack 1-30 to match AAC chip.  Zone RAM addresses at 32..61

  alias StackUnit d0
  define ACKADDR 1

  alias StsNrml r0
  alias StsUnAk r1
  alias StsAckd r2
  alias StkPtr  r3  
  alias LUT0    r4
  alias LUT1    r5
  alias LUT2    r6
  alias Acknldg r7
  alias LUT3    r8
  alias LUT4    r9
  alias LUT5    r10
  alias RamAddr r11
  alias PerTick r12
  alias Step    r13
  alias Scrtch2 r14
  alias Scratch r15

  poke 31 -1 # Init safety sentinel value
  move r4 0	# Init alarm state LUT
  move r5 1
  move r6 2  
  move r8 0
  move r9 2
  move r10 2

start:
  move sp 62
  move RamAddr 30
  
  mul Scratch StsAckd 1000	    # Put aggregate statistics together
  add Scratch Scratch StsNrml
  mul Scrtch2 StsUnAk 1000000
  add Scratch Scratch Scrtch2
  s db Setting Scratch
  move StsNrml 0
  move StsAckd 0
  move StsUnAk 0
  
  get Scratch d0 ACKADDR		# Process alarm acknowledgement signal, in a way that won't clobber other ASCs using the same address
  snez Scratch Scratch
  or Scrtch2 Acknldg Scratch
  bne Scrtch2 9 noclear
  put d0 ACKADDR 0
  move Scratch 0

noclear:
  select Acknldg Scratch 8 4
  move Step 3
  
tick:
  sub Step Step 1
  bltz Step start
  move PerTick 10
  yield
  
next:
  sub PerTick PerTick 1			# Keep track of how many ALARM STATE values we have processed this tick
  sub StkPtr StkPtr 1           # Decrement stack ram index pointer
  pop RamAddr					# Get the next Zone RAM address for ALARM STATE
  bltz RamAddr next				# If it's invalid, skip this entry
  get Scratch d0 RamAddr        # Read Zone RAM state
  add rr15 rr15 1               # Stats aggregate (pre-LUT because I have to)
  or Scratch Scratch Acknldg    # Set to Acknowledged if ACK flag set.  If the ALARM STATE is somehow not 0-2, this will almost certainly cause ASP state corruption or crash.
  poke StkPtr rr15              # Use LUT to write new ALARM STATE to Zone RAM
  put d0 RamAddr rr15           # Also write it to self RAM for AAC
  bgez PerTick next             # Check anti-race-condition limiter
  j tick