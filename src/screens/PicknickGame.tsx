import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { picknickGame } from '../content/picknick';
import { TicTacToe } from './picknick/TicTacToe';
import { RockPaperScissors } from './picknick/RockPaperScissors';
import { Memory } from './picknick/Memory';
import { Cups } from './picknick/Cups';
import { MiniSudoku } from './picknick/MiniSudoku';

/** /picknick/<spelletje>: het juiste spelletje tonen. */
export function PicknickGame() {
  const { spel = '' } = useParams();
  const [params] = useSearchParams();
  const game = picknickGame(spel);
  // Andere racer = nieuw potje (alles opnieuw beginnen).
  const key = `${spel}-${params.get('racer') ?? ''}`;
  if (game?.id === 'boter-kaas-en-eieren') return <TicTacToe key={key} game={game} />;
  if (game?.id === 'steen-papier-schaar') return <RockPaperScissors key={key} game={game} />;
  if (game?.id === 'memory') return <Memory key={key} game={game} />;
  if (game?.id === 'bekertje-schuiven') return <Cups key={key} game={game} />;
  if (game?.id === 'mini-sudoku') return <MiniSudoku key={key} game={game} />;
  return <Navigate to="/picknick" replace />;
}
