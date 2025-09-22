# SPSM PROJECT - SMC SYSTEM MONITOR CHIP
# Revision: 2025-09-19
# Variant: Stack-Driven
# Timing: Not synchronized
# Format: 0: ALARM TRIGGER Address (14), 1: Fault RefId Address (14)
# Monitors all IC10 chips for a fault state.  If found, the SMC may perform none, any, or all of the following operations:
# - Light a FAULT indicator
# - Set an ALARM TRIGGER in the linked STACK UNIT
# - Indicate the erroring chip's ReferenceId in a linked LED Display
# - Power-cycle the IC10 chips on Reset button press

  alias FaultIndicator d0
  alias ResetButton d1
  alias IdIndicator d2
  alias ZoneRAM d4
  
  alias NetworkIndex r14
  alias NetworkMax r13
  alias DevRefId r12  
  alias IC10 r9  
  alias Scratch r0
  alias Scratch2 r1
  
  move IC10 2037291645
  
start:
  yield
  bdns IdIndicator no_ind_nrm
  s IdIndicator On 0
  
no_ind_nrm: 
  lb Scratch IC10 Error Sum
  snez Scratch Scratch
  bdns FaultIndicator no_light
  s FaultIndicator On Scratch
  
no_light:
  bdns ZoneRAM no_trigger
  get Scratch2 db 0
  beqz no_trigger
  put ZoneRAM Scratch2 1
  
no_trigger:
  beqz Scratch start
  
rescan:
  move NetworkIndex 0
  lb NetworkMax IC10 PrefabHash Sum
  div NetworkMax NetworkMax IC10 	# Get the acount of IC10s on the network
  
scan:
  beqz NetworkMax start				# If we've enumerated all known IC10s, and didn't find one in error, restart
  get DevRefId db:0 NetworkIndex 	# Enumerate network devices, for IC10s
  add NetworkIndex NetworkIndex 1	# Increment network pointer
  l Scratch DevRefId PrefabHash		# Check if the last device we got an ID for is an IC10 chip
  bne Scratch IC10 scan
  sub NetworkMax NetworkMax 1  		# Decrement # of IC10s left to enumerate
  l Scratch DevRefId Error			# Check if this is the errored IC10
  beqz Scratch scan					# If not, check the next network device
  bdns IdIndicator no_ind_err		# If we have an ID indicator linked, light it up with the erroring RefId
  s IdIndicator On 1
  s IdIndicator Color 4
  s IdIndicator Mode 0
  s IdIndicator Setting DevRefId
  
no_ind_err:
  bdns ZoneRAM no_refid				# Otherwise, we found the device.  Do we write to Zone RAM?
  get Scratch db 0
  beqz no_refid						# If not (no RAM, or no write addr) skip to the reset wait
  put ZoneRAM Scratch DevRefId
  
no_refid:							# Start watching the error'd chip until it stops being errored
  yield
  bdns Scratch start		        # Make sure the erroring housing still exists before checking it again
  l Scratch DevRefId Error			# Just in case someone removes it (i.e. temporary socket)
  bnez Scratch still_error
  j start
  
still_error:
  bdns ResetButton no_refid			# If we don't have a reset button, wait for manual clear
  l Scratch ResetButton Setting
  beqz Scratch no_refid				# ... or if it's not pressed
  s DevRefId On 0					# Otherwise we do a power cycle on the errored chip
  yield
  s DevRefId On 1
  j start							# and lastly we reset the SMC