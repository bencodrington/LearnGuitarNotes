# Learn Guitar Notes

A guided guitar fretboard practice app based on the method taught by [MusicTheoryForGuitar on YouTube](https://youtu.be/PJddQ6Q0UDo?si=zLajcpPRgyRgJFG3).

## What it does

The app guides you through a structured daily routine for memorising every note on the guitar neck:

1. **Natural notes** — Learn the natural notes on each string
2. **Add metronome** — 40 BPM
3. **Sharps & flats** — Extended note set
4. **Two notes** — Transition smoothly between random notes.
5. **Seven notes** — Chain several transitions back to back
6. **Level up** — Select a higher BPM and restart from step 2.


## Development

```bash
yarn install
yarn run dev        # starts dev server (exposed on local network for mobile via --host)
yarn run build      # production build
```

## Deployment
```bash
firebase login
firebase deploy
```