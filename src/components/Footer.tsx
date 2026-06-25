import githubIcon from '../assets/github.svg';

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>
        Based on{' '}
        <a
          href="https://youtu.be/PJddQ6Q0UDo?si=zLajcpPRgyRgJFG3"
          target="_blank"
          rel="noopener noreferrer"
        >
          MusicTheoryForGuitar on YouTube
        </a>
      </p>
      <a
        href="https://github.com/bencodrington/LearnGuitarNotes"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        className="footer-github-link"
      >
        <img src={githubIcon} width="20" height="20" alt="" aria-hidden="true" />
      </a>
    </footer>
  );
}