import { useState, useEffect, useRef } from "react";
import "./index.css";

const dialogues = [
  {
    text: "Active-toi.",
    audio: "https://static.wixstatic.com/mp3/b9ad46_8c7063409f8f4fe1836a6a7bb5407f49.mp3",
  },
  {
    text: "Si je troue mon dernier pantalon, je suis mort.",
    audio: "https://static.wixstatic.com/mp3/b9ad46_8c7063409f8f4fe1836a6a7bb5407f49.mp3",
  },
  {
    text: "On est là !",
    audio: "https://static.wixstatic.com/mp3/b9ad46_8c7063409f8f4fe1836a6a7bb5407f49.mp3",
  },
  {
    text: "Malone, regarde.",
    audio: "https://static.wixstatic.com/mp3/b9ad46_8c7063409f8f4fe1836a6a7bb5407f49.mp3",
  },
];

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showClickToStart, setShowClickToStart] = useState(false);
  const [clickedIndexes, setClickedIndexes] = useState([]);
  const [volume, setVolume] = useState(0.5);
  const [showLogo, setShowLogo] = useState(false);
  const [showChapterTitle, setShowChapterTitle] = useState(false);
  const [showLiseuse, setShowLiseuse] = useState(false);
  const [fixedLogo, setFixedLogo] = useState(false);
  const backgroundAudioRef = useRef(null);
  const additionalAudioRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      setShowClickToStart(true);
      document.body.style.overflow = 'auto'; // Enable scrolling
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const startBackgroundMusic = () => {
    toggleFullscreen();

    const backgroundAudio = new Audio("https://static.wixstatic.com/mp3/b9ad46_b2e30b69ac3e4765a77fe40f723f9006.mp3");
    backgroundAudio.loop = true;
    backgroundAudio.volume = volume;

    const additionalAudio = new Audio("https://static.wixstatic.com/mp3/b9ad46_4751955cb29142dd874d1089120796de.mp3");
    additionalAudio.loop = false; // Play once
    additionalAudio.volume = volume;

    const playAudio = () => {
      backgroundAudio.play().catch(() => {
        document.body.addEventListener('click', () => {
          backgroundAudio.play();
        }, { once: true });
      });
      additionalAudio.play().catch(() => {
        document.body.addEventListener('click', () => {
          additionalAudio.play();
        }, { once: true });
      });
    };

    playAudio();
    backgroundAudioRef.current = backgroundAudio;
    additionalAudioRef.current = additionalAudio;
    setShowClickToStart(false);
    setShowLogo(true);
    setTimeout(() => {
      setShowLogo(false);
      setShowChapterTitle(true);
    }, 3000); // Show chapter title after 3 seconds
    setTimeout(() => {
      document.body.classList.add('background-fade');
      setTimeout(() => {
        setShowChapterTitle(false);
        setShowLiseuse(true);
        setFixedLogo(true);
        document.body.style.overflow = 'auto'; // Enable scrolling
      }, 2000); // Show liseuse after 2 seconds
    }, 7000); // Trigger background fade after 4 seconds
  };

  const playAudio = (url, index) => {
    const audio = new Audio(url);
    audio.play();
    setClickedIndexes([...clickedIndexes, index]);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = newVolume;
    }
    if (additionalAudioRef.current) {
      additionalAudioRef.current.volume = newVolume;
    }
  };

  const getDialogueAudio = (text) => {
    const dialogue = dialogues.find(d => d.text === text);
    return dialogue ? dialogue.audio : null;
  };

  return (
    <div className={`texte-container ${showIntro ? 'intro' : ''} ${showClickToStart ? 'fadeOut' : ''} ${showLiseuse ? 'fadeInText' : ''}`}>
      {showIntro ? (
        <div className="chapter-container">
          <div className="chapter-title animate-title osrase-text">Osrase</div>
          <div className="chapter-subtitle animate-title sound-tales-text">Une production Sound Tales</div>
        </div>
      ) : showClickToStart ? (
        <div className="click-to-start animate-click" onClick={startBackgroundMusic}>
          <div className="main-title">Cliquer pour lancer le Tale</div>
          <div className="subtitle">Astuce : faîtes vivre les dialogues en appuyant dessus.</div>
        </div>
      ) : showLogo ? (
        <img
          className="logo centered-logo animate-logo"
          src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png"
          alt="Logo Sound Tales"
        />
      ) : showChapterTitle ? (
        <>
          <div className="chapter-title-container fade-in">
            <div className="chapter-title animate-title">CHAPITRE 1</div>
            <div className="chapter-subtitle animate-title">À jamais, pour toujours</div>
          </div>
          <img
            className={`logo ${fixedLogo ? 'fixed-logo' : 'bottom-right-logo animate-logo'}`}
            src="https://static.wixstatic.com/media/b9ad46_8add9043f7aa4f9fab249ccd3afe64f8~mv2.png"
            alt="Logo Sound Tales"
          />
        </>
      ) : showLiseuse ? (
        <>
          <div className="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              orient="vertical"
            />
          </div>
          <div className="chapter-text">
            <p></p>
            {dialogues.map((dialogue, index) => (
              <div
                key={index}
                className={`dialogue-group ${clickedIndexes.includes(index) ? 'clicked' : ''}`}
                onClick={() => playAudio(dialogue.audio, index)}
              >
                <div className="vertical-line"></div>
                <p>{dialogue.text}</p>
              </div>
            ))}

            <p>
              En travaux mais masterclass il est 3h je suis dessus depuis 6H envie de creveeeer
            </p>
          </div>
          <div className="navigation-bar">
            <button className="nav-button">Chapitre précédent</button>
            <button className="nav-button" onClick={() => window.location.href='https://audiotalecontact.wixsite.com/audiotale'}>Accueil</button>
            <button className="nav-button">Chapitre suivant</button>
          </div>
          <div className="fullscreen-toggle" onClick={toggleFullscreen}>
            <img src="https://static.wixstatic.com/media/b9ad46_e4281c264650431b8d0292f70cb39288~mv2.png" alt="Fullscreen Icon" />
          </div>
        </>
      ) : null}
    </div>
  );
}