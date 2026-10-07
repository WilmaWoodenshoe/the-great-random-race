import { nl } from '../content/nl';
import { PrimaryButton } from '../components/PrimaryButton';

export function NotFound() {
  return (
    <div className="screen not-found">
      <h1 className="kop kop--36">{nl.notFound.title}</h1>
      <p>{nl.notFound.text}</p>
      <PrimaryButton to="/home">{nl.notFound.home}</PrimaryButton>
    </div>
  );
}
