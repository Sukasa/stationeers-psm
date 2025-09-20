# SPSM PROJECT - SMC SYSTEM MONITOR CHIP
# Revision: 2025-09-19
# Variant: Stack-Driven
# Timing: Not synchronized
# Format: n: ReferenceId (53)
# Monitors all IC10 chips for a fault state, and illuminates a FAULT indicator.  For registered IC10 chips, offers the ability to power-cycle any chips that are in error
# Does not interact with any S-PSM systems or data other than the IC10 error states, power states (for resets), and the FAULT indicator/RESET button

  alias FaultIndicator d0
  alias ResetButton d1
  
start:
  yield
  lb r15 1512322581 Error Sum
  bdns d0 nolight
  s d0 On r15
nolight:
  bdns d1 start
  l r0 d1 Setting
  beqz r0 start
  move sp 512
next:
  pop r0
  bdns r0 start
  l r1 r0 Error
  beqz r0 next
  s r0 On 0
  yield
  s r0 On 1
  j next