
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
- [EI] EQUIPMENT INITIALIZATION (a specialization of OR) to transfer constant values to DISPLAY UNITS and OPERATION UNITS, once at system startup.
- [AA] ALARM ANNUNCIATOR (a specialization of OR) read ALARM STATE values effect them on displays to visualize inactive/active/acknowledged alarms.

- [SD] STACK DATA (splitting the difference between OR and PL) are block transfers of data between STACK UNITS, e.g. transferring data between ZONE RAM blocks, or interfacing with advanced network devices
- [SM] SYSTEM MONITOR observes an IC10 for `Error` states, and sets both an ALARM STATE and directly activates a "Fault" light to make operators aware of malfunctioning control systems at a high criticality.

- [ST] SCHMITT TRIGGER is as it says on the tin. You give it `Raise` and `Hold` booleans, and it gives you a `Q` boolean output. When `Q` is low and `Raise` is high, `Q` goes high. When `Q` is high and `Hold` is low, `Q` goes low. Effectively, `Raise` is an active-high Set signal and `Hold` is an active-low Reset signal.
- [IL] INTERLOCK is a function to copy a value from one place to another ONLY when all of a set of "Barrier" signals are low.

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

Each Code Block can be placed at these scopes...
- Zone Init: once when powering up, per instance.
- Processor Init: once when powering up, per chip on which this function type appears.
- Cycle Init: once per processor per function type, each cycle before all instances.
- Instance: once per function instance.
- Array: once per value of a named Configuration Variable, otherwise placed in definition order amongst other 'Instance' scopes.
- Cycle Outro: once per processor cycle, after all instances.

Each Code Block can have optional constraints...
- Immediately After Related Function (by relation name)
- Same Processor as Related Function (by relation name)
- Different Processor as Related Function (by relation name)
- Array is Singular (Length = 1) (by Relation or Property name)
- Array is Plural   (Length > 1) (by Relation or Property name)

Each Code Block has an optional "group name"; if it has a group name, then no constraint error will be raised so long as AT LEAST ONE block in that group passes its constraints. When multiple pass, only one of them will be included in the output, and it will be some member of the group with a maximal number of constraints. This is how you can have a function which depends on another function, and have it generate different code varying by e.g. whether it is placed in the same Processor as that other function or not.

Array Code Blocks can have an optional 'indices' field, containing some subset of the strings 'first', 'mid', 'last', 'even', and 'odd'. If present, that block will only output if the current element of the array satisfies at least one of the listed constraints. 'mid' means neither the first nor last.
 - Array Length 0: none output
 - Array Length 1: only 'first' or 'even' output
 - Array Length 2: only 'first' and 'last' output
 - Array Length 3: 'first', 'mid', and 'last' output, per their separate blocks.

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
- Register exposes `%name%` (its value)
- Buffer exposes `%B.RAM` and `%B.name%`, the storage device and first address offset within that device. Yes, all buffers of a given function type will be allocated to the same RAM storage.
- Equipment exposes `%name%` (its RefId)
- Equipment with subtype 'Logic' also `%name.ReferenceId%` and `%name.Logic%`
- Data exposes `%name.RAM%` and `%name.Addr%`, the storage device and first address offset within that device.
- Function exposes each of its configuration variable values with its own `name.` as a prefix.
- array CVs are only valid within an Array code block of the same variable.
