- The set of natural notes is A, B, C, D, E, F, G
- Each step has different requirements
- Display the instructions for the current section within the current step, and display a button for the user to click/tap when they're done the current section within the current step
- TODO: list steps
- TODO: skip controls

# Timer
- On page load, prompt: "How long are you practicing for today?"
- Options: 5 minutes, 10 minutes
- On click, start a timer. Show the values ticking down in the top right corner in subdued grey text, with a progress bar filling up.
- When the timer completes, replace the timer with a filled-check-circle icon in green

# Main practice view
- Once the timer is set, most of the page becomes devoted to the current practice step

## Progress
- A progress stepper near the top of the screen should show which step the user is on
- A second stepper below it should show the user's progress within the current step
- Tapping any step or section within a step should switch to that section or step

## Current step
- Show the instructions for the current step
- Show a large, prominent Next button

### Steps:

#### Step 1: Each note on each string
1. For each of the natural notes (A, B, C, D, E, F, G) in a random order
  a. Play {note} on each string, thick to thin, then back
  b. Do so at any speed, but restart if you make a mistake
  c. Move onto the next note when you've gone up and down 3x without a mistake

Completion criteria: Move to Step 2 when you've gone through all of the natural notes twice.

Implementation note: Shuffle the natural notes after the user goes through them all the first time.

#### Step 2: Add metronome
- Same exercise as above
- 40bpm, one note per beat

Completion Criteria: Move to Step 3 after you've gone through all the natural notes once

Implementation Notes:
- Play a metronome beep sound at 40bpm.
- Display a large mute icon to toggle the sound on and off.
- The icon should clearly display if it's muted or not
- Again, shuffle the notes before starting this step

#### Step 3: Add sharps and flats
- Same exercise as step 2, but add sharps and flats

Completion criteria: Move to Step 4 after you've gone through all the notes.

Implementation Notes:
- Include duplicate names, e.g. A flat AND G#
- Use the flat icon instead of the word flat
- Keep the metronome



#### Step 4: Two notes, one going up, one going down
- Choose two random notes from the extended set (including sharps and flats)
- Play one going up, then play the other coming down
- Loop smoothly between those two notes, never stop when switching notes.
- Repeat this pair until it feels easy. Click the next button to get a new pair.

Completion criteria: Complete seven pairs.

Implementation notes:
- When randomly selecting pairs of notes, don't allow alternate names for the same note to be paired (e.g. A flat and G# are both valid options, but not in the same pair)

#### Step 5: 7 notes
- Randomly select 7 notes from the extended set
- Play the first up, then the second down, then the third up, and so on.

Completion criteria: Complete 3 shuffled orderings

#### Step 6: Increase metronome speed
- Level up! Select new BPM

Implementation notes:
- Show a grid of buttons, from 40bpm to 80bpm in 5bpm intervals
- Whatever the current speed is, show a "Recommended" border and label around the next BPM setting up
- Don't show a "next" button
- As soon as the user makes a selection, update the metronome speed and jump to Step 2

## Footer
- Footer at the bottom with a link to the source of the method (MusicTheoryForGuitar on youtube). Phrasing should be "Based on ..."

## Meta
- Remove the placeholder boilerplate code
- Update README.md to describe what the app is at a high level, and how to use it
- Update the default dev command to use --host to expose it for mobile
- Progress (which step you're on, what you've completed in each step) should be saved in localstorage and read on page load
- Responsive layout to look good on mobile or desktop