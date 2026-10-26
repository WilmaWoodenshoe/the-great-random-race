import { Navigate, useParams } from 'react-router-dom';
import { picknickGame } from '../content/picknick';
import { TicTacToe } from './picknick/TicTacToe';
import { RockPaperScissors } from './picknick/RockPaperScissors';

/** /picknick/<spelletje>: het juiste spelletje tonen. */
export function PicknickGame() {
  const { spel = '' } = useParams();
  const game = picknickGame(spel);
  if (game?.id === 'boter-kaas-en-eieren') return <TicTacToe game={game} />;
  if (game?.id === 'steen-papier-schaar') return <RockPaperScissors game={game} />;
  return <Navigate to="/picknick" replace />;
}
