
# Stationeers Process Safety Management

This suite is meant to help us manage...

- Process Assets (equipment, pipe networks, electrical networks, sensors, control devices)
- Process Software (microcontroller code for IC10 modules)
- Process Configuration (data put in the RAM of IC10 modules)


In a given environment, we have logic-network-connected devices of the following types. Some devices can qualify as more than one unit simultaneously...

- SENSOR UNITS are where we pull process readings from (e.g. temperature, pressure, etc), some of which have Slots (e.g. chute equipment, card readers, air filters)
- CONTROL UNITS are input devices users interact with (e.g. buttons, switches, dials, keypads, sliders)
- DISPLAY UNITS are output devices which users observe to interpret the process state (e.g. displays, graphs, lights, the colour of input buttons)
- OPERATION UNITS are devices which effect changes in our processes (e.g. valves, vents, doors, lights)
- STACK UNITS are those which have RAM which is remotely manipulatable via the `get`/`put` IC10 instructions (e.g. sorters, IC10s, RAM chips)


To manage the devices in a given operation zone. Each ZONE has a RAM chip which is used to mirror and maintain state data. We then have a variety of OPERATIONS between UNITS.

- [IR] INPUT ROUTER which transfer information from SENSOR UNITS and CONTROL UNITS to the ZONE RAM.
- [SR] SLOT INPUT ROUTER (a specialization of IR) transfer information from SENSOR UNITS' Slots to ZONE RAM.
- [XR] INTERRUPT ROUTER transfers `Setting` values to ZONE RAM only when nonzero, and expect Application Processors to clear that state. These always have maximum Priority.

- [PL] PROCESS LOGIC perform zone-specific logic from values in Zone RAM, to values in Zone RAM.
- [AS] ALARM STATE (a specialization of PL) updates ALARM STATE values based on ALARM CHECK values and an ACKNOWLEDGE signal.

- [OR] OUTPUT ROUTER (the inverse of INPUT ROUTER) transfer information from ZONE RAM to DISPLAY UNITS and OPERATION UNITS.
- [AA] ALARM ANNUNCIATOR (a specialization of OR) read ALARM STATE values effect them on displays to visualize inactive/active/acknowledged alarms.

- [SD] STACK DATA (splitting the difference between OR and PL) are block transfers of data between STACK UNITS, e.g. transferring data between ZONE RAM blocks, or interfacing with advanced network devices
- [SM] SYSTEM MONITOR observes other IC10 implementations for `Error` states, and sets both an ALARM STATE and directly activates a "Fault" light to make operators aware of malfunctioning control systems at a high criticality.



# IR INLINE
	l %R0% %SRef% %SLogic%
	putd %RAM% %PVAddr% %R0%
# IR ALARM TEST (append to above, one per test)
# e.g. if ALSelOp=sgt, R1 = (PV > PVALValue)
	%ALSelOp% %R1% %R0% %PVALValue%
	putd %RAM% %ATAddr% %R1%

# NVRAM TABLE %TB_ACKON%
	0 0 0 1 2 2
# NVRAM TABLE %TB_ACKNO%
	0 1 0 1 1 2
# AS INLINE (once per tick)
	getd %R_ACK% %RAM% %ACKAddr%
	select %R_ACK% %R_ACK% %TB_ACKON% %TB_ACKNO%
	putd %RAM% %ACKAddr% 0

# AS INLINE (append to IR ALARM TEST)
	getd %R2% %RAM% %ASAddr%  # Read current alarm state
	select %R1% %R1% 3 0      # +3 to table addr if trigger is on
	add %R1% %R1% %R2%        # Add table offset
	add %R1% %R1% %R_ACK%     # Add table select
	getd %R1% db %R1%         # Read table in local NVRAM
	putd %RAM% %ASAddr% %R1%  # Write new alarm state


# [IRC] v1 - Processes a list of input mappings and the RAM addresses to write them to
# Entries are bit-packed, so this can theoretically process up to 512 input mappings, at just over 25 mappings per second
# Low 14 bits are RAM Address to write to
# Next 9 bits are LogicType enum value
# Remaining bits are ReferenceId of device to read LogicType from

Start:
  yield
  move sp 512

Loop:
  pop r0
  and r1 r0 8191
  srl r0 r0 14
  and r2 r0 511
  srl r0 r0 9
  bdns r0 Start
  l r3 r0 r2
  put d0 r1 r3
  beqz sp Start
  j Loop



# [XRC] v1 - Processes a list of input mappings and the RAM addresses to write them to
# For all entries, the lower 14 bits are the RAM address and the upper bits are the ReferenceID of the device to read
# Only writes non-zero values, and only reads one LogicType
# Entries are bit-packed and this can theoretically process up to 511 input mappings, at between 16-21 inputs per tick
# Ideally, map only 20 pulse inputs through this and assume only one will be active at any time

  define Type Setting

Start:
  yield
  move sp 512

Loop:
  pop r0
  and r1 r0 8191
  srl r0 r0 14
  bdns r0 Start
  l r3 r0 r2
  beqz r3 Loop
  set RAM r1 r3
  j Loop


# Alarm State Chip
# Timing: 4init + 6/loop + 9/alarm
# Variant: Stack-Based
# ACK request should be written as `1` to chip housing Setting
# Own RAM is populated with a series of ALARM TRIGGER, ALARM STATE address pairs.
# At most 255 entries (in RAM 2..511) are supported.
alias ASA r13
alias ATA r14 # Alarm Trigger
alias ASV r15 # ASV MUST BE R15!!
define ZoneRAM %ZONERAM%
# 0=CLEAR, 1=UNACK'D ALARM, 2=ACK'D ALARM
init: # 6-entry Lookup table in registers
  move r0  0  # CLEAR, TRIGGER OFF => CLEAR
# move r1  X  # UNACK, TRIGGER OFF => CLEAR w/ACK, UNACK w/out
  move r2  0  # ACKED, TRIGGER OFF => CLEAR
  move r3  1  # CLEAR, TRIGGER ON  => UNACK
# move r4  1  # UNACK, TRIGGER ON  => ACKED w/ack, UNACK w/out
  move r5  2  # ACKED, TRIGGER ON  => ACKED
reset:
  move sp 512
  l r1 db Setting  # Read ACK request
  select r4 r1 2 1 # Interpret again
  s db Setting 0   # Clear request
loop:
  pop ASA
  beqz ASA reset
  pop ATA
  getd ASV ZoneRAM ASA
  getd ATA ZoneRAM ATA
  select ATA ATA 3 0
  add ASV ASV ATA
  putd ZoneRAM ASA rr15 # R15 is ASV
  j loop
