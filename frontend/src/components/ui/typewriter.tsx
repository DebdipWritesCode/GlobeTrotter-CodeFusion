import React, { useEffect, useMemo, useRef, useState } from "react";

type TypewriterProps = {
  words: string[];
  typingSpeed?: number; // ms per char
  deletingSpeed?: number; // ms per char when deleting
  pauseBetweenWords?: number; // ms pause after a word completes
  loop?: boolean;
  className?: string;
};

const Typewriter: React.FC<TypewriterProps> = ({
  words,
  typingSpeed = 70,
  deletingSpeed = 45,
  pauseBetweenWords = 1200,
  loop = true,
  className,
}) => {
  const [index, setIndex] = useState(0); // which word
  const [subIndex, setSubIndex] = useState(0); // char position
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  const currentWord = useMemo(() => words[index % words.length] ?? "", [index, words]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // caret blink
    const blinkInt = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkInt);
  }, []);

  useEffect(() => {
    if (!currentWord) return;

    // if the word is fully typed, pause then start deleting
    if (!deleting && subIndex === currentWord.length) {
      const pause = setTimeout(() => {
        setDeleting(true);
      }, pauseBetweenWords);
      return () => clearTimeout(pause);
    }

    // when deleting finished
    if (deleting && subIndex === 0) {
      const next = index + 1;
      if (!loop && next >= words.length) return; // stop
      setDeleting(false);
      setIndex(next % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, currentWord, typingSpeed, deletingSpeed, pauseBetweenWords, loop, index, words.length]);

  useEffect(() => {
    // reset subIndex when word changes
    setSubIndex(0);
  }, [index]);

  const text = currentWord.slice(0, subIndex);

  return (
    <span className={className}>
      {text}
      <span className={`inline-block w-[1ch] ${blink ? "opacity-100" : "opacity-0"}`}>|</span>
    </span>
  );
};

export default Typewriter;
