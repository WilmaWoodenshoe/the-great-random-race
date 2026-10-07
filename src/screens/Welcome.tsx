import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nl } from '../content/nl';
import { useGame } from '../state/GameProvider';
import { canStartRace } from '../game/session';
import { playerRacer } from '../content';
import { PrimaryButton } from '../components/PrimaryButton';
import { PhoneDownload } from '../components/Icons';
import { LivingRacer } from '../components/Gerard';
import { img } from '../utils/images';

/** Eerste start (Welcome.html). */
export function Welcome() {
  const t = nl.welcome;
  const { startNewRace, save, now } = useGame();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Loopt er al een race, dan gewoon daarheen.
      if (canStartRace(save, now)) await startNewRace();
      navigate('/home', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen welcome">
      <img className="welcome__bg" src={img('backgrounds/bg-staand.webp')} alt="" />
      <header className="welcome__header">
        <img className="logo logo--groot" src={img('ui/logo.png')} alt={nl.app.logoAlt} />
      </header>

      <main className="welcome__main">
        <div className="welcome__hero">
          <LivingRacer image={playerRacer.image} alt={t.gerardAlt} className="welcome__gerard" />
        </div>
        <div className="welcome__intro">
          <h1 className="kop kop--36">{t.title}</h1>
          <p className="welcome__text">{t.intro}</p>
          <p className="welcome__text welcome__text--zacht">{t.relax}</p>
        </div>
        <div className="tip">
          <PhoneDownload />
          <div>
            <b>{t.installTitle}</b> {t.installIphone} <b>{t.installIphoneShare}</b> {t.installIphoneChoose}{' '}
            <b>{t.installIphoneAction}</b>. {t.installAndroid} <b>{t.installAndroidMenu}</b> {t.installIphoneChoose}{' '}
            <b>{t.installAndroidAction}</b>. {t.installWhy}
          </div>
        </div>
      </main>

      <div className="screen__footer">
        <PrimaryButton onClick={start} arrow={!busy}>
          {busy ? t.starting : t.start}
        </PrimaryButton>
      </div>
    </div>
  );
}
