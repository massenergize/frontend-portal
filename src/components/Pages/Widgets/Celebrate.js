import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

function Celebrate({
  show,
  pieces = 400,
  gravity = 0.12,
  duration = 10000,
  close,
}) {
  const [options, setOptions] = useState({ pieces, opacity: 1 });
  useEffect(() => {
    if (!show) return;
    const startDuration = 0.7 * duration;
    const endDuration = 0.3 * duration;

    setTimeout(() => {
      setOptions({ pieces: 150, opacity: 0.4 });
      setTimeout(() => {
        close && close();
        setOptions({ pieces: 400, opacity: 1 }); // set back to default when ending
      }, endDuration);
    }, startDuration);
  }, [show, duration, close]);

  if (!show) return <></>;

  return (
    <Confetti
      width={window.screen.width}
      height={window.screen.height + 250}
      numberOfPieces={options.pieces}
      initialVelocityY={10}
      gravity={gravity}
      opacity={options.opacity}
    />
  );
}

export default Celebrate;
