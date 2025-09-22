
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
- DATA UNITS are words in a STACK UNIT, usually automatically allocated to implement specific functions, but also manually allocatable. Those with fixed addresses get allocation priority, followed by those with address constraints, then those without constraints.


To manage the devices in a given operation zone. Each ZONE has a RAM chip which is used to mirror and maintain state data. We then have a variety of OPERATIONS between UNITS.

- [IR] INPUT ROUTER which transfer information from SENSOR UNITS and CONTROL UNITS to the ZONE RAM.
- [SR] SLOT INPUT ROUTER (a specialization of IR) transfer information from SENSOR UNITS' Slots to ZONE RAM.
- [XR] INTERRUPT ROUTER transfers `Setting` values to ZONE RAM only when nonzero, and expect Application Processors to clear that state. These always have maximum Priority.

- [PL] PROCESS LOGIC perform zone-specific logic from values in Zone RAM, to values in Zone RAM.
- [AT] ALARM TRIGGER updates ALARM TRIGGER values based on process values.
- [AS] ALARM STATE (a specialization of PL) updates ALARM STATE values based on ALARM TRIGGER values and an ACKNOWLEDGE signal.

- [OR] OUTPUT ROUTER (the inverse of INPUT ROUTER) transfer information from ZONE RAM to DISPLAY UNITS and OPERATION UNITS.
- [AA] ALARM ANNUNCIATOR (a specialization of OR) read ALARM STATE values effect them on displays to visualize inactive/active/acknowledged alarms.

- [SD] STACK DATA (splitting the difference between OR and PL) are block transfers of data between STACK UNITS, e.g. transferring data between ZONE RAM blocks, or interfacing with advanced network devices
- [SM] SYSTEM MONITOR observes an IC10 for `Error` states, and sets both an ALARM STATE and directly activates a "Fault" light to make operators aware of malfunctioning control systems at a high criticality.


To produce the necessary code to implement these connections, we want to draw diagrams of the process, annotate them with equipment ReferenceIDs and any hand-screwed configuration, and have the system generate the programs for the IC10s, and burner programs for the IC10's NVRAM.

Ideally, we'd like to be able to save not just the diagrams, but generate manifests of what equipment needs to be installed to implement them, and what chips need (re)programming to effect the changes from one diagram revision to the next.

To effect this, we want to design FUNCTIONS, allocate them to hardware, and be able to preview those allocations time costs.


## VERSION 1.0

- You can create a new Equipment Type by defining and labelling its port configurations (Gas,Liquid,Network,Power), and defining its supported Logic Types.

- You have a list of Zones.
- You have a list of Diagrams. Equipment, Networks, and drawing Elements can appear on multiple Diagrams each.

- You can create Equipment by adding it to at least one Zone. If it doesn't appear on at least one Diagram, you will get a warning.
- If a piece of Equipment is written to by Functions in more than one Zone, you will get a warning.

- You can create visual-only elements to Diagrams, ideally with some snapping and routing helpers.
- You can draw Networks on Diagrams -- Gas, Liquid, and Electrical -- ideally with some snapping and routing helpers. The same Network can be depicted differently on separate Diagrams, and there can be off-page connections.
- You can give Equipment a name, a ReferenceID, and some freehand notes.

- IC10 Equipment has a special treatment; you can label them as using custom software, or you can tag them as PROCESSOR equipment.
- Utility Memory has a special treatment; you can tag them OR IC10s as being Zone RAM.
- Functions must be assigned to Zones. They have to get allocated to a PROCESSOR and will allocate pieces of Zone RAM for their needs, but both should be automatically allocated but manually overridable.
- Metafunctions -- recipes that create a whole batch of related functions easily -- ought to be a thing.
- Functions need a PRIORITY. This is the maximum number of ticks -- there are two ticks per second -- that is allowed to pass without this function executing. This is used to prioritize how functions are distributed across PROCESSORS. [XR] functions, for instance, have a fixed PRIORITY of 1; their whole point is that they run every tick.
- Custom [PL] functions have custom code, and can (and usually *must*) include substitutions which will be filled in at compile time.


## In summary...

- EquipmentTypes
- Zones
- Diagrams
- Drawings
- Equipment
- Networks
- Metafunctions
- Functions
- Data Units

Each of those need storage for permanent elements, and we need an interpretation layer that lets us virtually generate more, and validate and compile on the result of that.

We want to be able to override the configuration of the virtually generated functions and data units that come out of a Metafunction.


## GUI Design

- Left side: Diagram Explorer (pan, zoom, select, add, remove, edit). Can also be maximized. When Printing, this is the only part of the UI included.
- Mid-right: Property panels (the selected item in Diagram Explorer, plus each pinned property panel, all in a scrollable pane)
- Far right: Navigator (filterable tree of all objects)


## Functions

Functions have code blocks in a few types, and configuration variables which can be manually set or automatically filled.

Each Code Block can run at...
- Zone Init: once when powering up, once per zone.
- Processor Init: once when powering up, once per chip on which this function type appears.
- Prologue: once per processor cycle, before all instances.
- Instance Intro: once per function instance.
- Array: once per value of a named Configuration Variable, contiguous between instance intro and instance outro.
- Instance Outro: once per function instance.
- Epilogue: once per processor cycle, after all instances.

Each Code Block can have optional constraints...
- Immediately After Function in Configuration Variable X
- Same Processor as Function in Configuration Variable X
- Different Processor as Function in Configuration Variable X

Each Code Block has an optional "group name"; if it has a group name, then for each group, no constraint error will be raised so long as exactly one block passes its constraints. This is how you can have a function which depends on another function, and have it generate different code varying by whether it ends up in the same Processor as that other function or not.

Each Configuration Variable comes in a variety of types:
- Constant: some user-filled constant, with optional default and with constraints including 'numeric', 'text', 'logic'
- Equipment: a piece of equipment by PSMID, but its ReferenceId is what will be exposed as a variable. Filterable by a list of required logic types.
- Data: an arbitrary data unit in the zone, with an optional user-bypassable filter for name.
- Buffer: a shared block of RAM in the zone used by all instances of this function which have the same value of a named Constant configuration variable. Otherwise the same as Data.
- Function: another function object, with an optional filter for type.
- Register: a register allocated to this function, can be fixed or any available.
- Code: multiline text with syntax highlighting for use in custom PL blocks
- a Configuration Variable can be of 'Array' type so long as there is a Code Block of Array type matching it.

Each Configuration Variable exposes some Configuration Values to the code compiler.
- Constant exposes `%name%` (its value)
- Equipment exposes `%name%` (its RefId)
- Data exposes `%name.RAM%` and `%name.Addr%`, the storage device and first address offset within that device.
- Buffer exposes `%B.RAM` and `%B.name%`, the storage device and first address offset within that device.
- Function exposes each of its configuration variable values with its own `name.` as a prefix.
- Register exposes `%name%` (its value)
- array CVs are only valid within an Array code block of the same variable

Substitutions are made in code blocks...
- `%name%` is replaced with the matching configuration value.
- `%name|name|..%` is replaced with the first configuration value which is not the empty string.


# [IR] INSTANCE INTRO
	l %R0% %SRef% %SLogic%
# [IR] ARRAY (PV)
	putd %PV.RAM% %PV.Addr% %R0%

# [SR] INSTANCE INTRO
	ls %R0% %SRef% %SSlotNo% %SLogic%
# [SR] ARRAY (PV)
	putd %PV.RAM% %PV.Addr% %R0%

# [XR] INLINE
	l %R0% %SRef% Setting
	breqz %R0% 2
	putd %RAM% %IntAddr% %IntSignal|R0%

# [AT] INLINE (append to each [IR/SR], one per test on that same variable)
# e.g. if ALSelOp=sgt, R1 = (PV > PVALValue)
	%ALSelOp% %R1% %IF.R0% %PVALValue%
	putd %AT.RAM% %AT.Addr% %R1%

# [AS] Prologue (required for each chip that includes 1+ [AS] INLINE)
# NVRAM TABLE %B.ACKON%
	0 0 0 1 2 2
# NVRAM TABLE %B.ACKNO%
	0 1 0 1 1 2
# [AS] INLINE (once per tick; needs one ACKAddr per chip)
	getd %R_ACK% %ACK.RAM% %ACK.Addr%
	select %R_ACK% %R_ACK% %B.ACKON% %B.ACKNO%
	putd %ACK.RAM% %ACK.Addr% 0
# [AS] INLINE (append after each [AT])
	select %R2% %AT.R1% 3 0       # +3 to table addr if trigger is on
	getd %R3% %AS.RAM% %AS.Addr%  # Read current alarm state
	add %R2% %R2% %R3%            # Add table offset
	add %R2% %R2% %R_ACK%         # Add table select
	getd %R2% %B.RAM% %R2%       # Read table
	putd %AS.RAM% %AS.Addr% %R2%  # Write new alarm state

# [OR] INLINE
	getd %R0% %RAM% %MVAddr%
	s %DRef% %DLogic% %R0%

# [AA] Init (once at powerup for each chip that includes 1+ [AA] INLINE)
	move   r0 0
	move   r2 1
# [AA] Prologue (required for each chip that includes 1+ [AA] INLINE)
	select r1 0 1
# [AA] INLINE
	getd %R0% %RAM% %ASAddr%
	s %AARef% On r%R0%





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
