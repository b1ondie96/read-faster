import { useEffect, useState } from "react";

import Input from "@mui/material/Input";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

function App() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [readTime, setReadTime] = useState(130);
  const [input, setInput] = useState("");
  const words = input.split(" ");
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = setInterval(() => {
        setWordIndex((curr) => {
          if (curr + 1 >= words.length) {
            return words.length - 1;
          }
          return (curr + 1) % words.length;
        });
      }, readTime);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [readTime, isPlaying, words.length]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReadTime(
      typeof event.target.value === "number" ? 150 : Number(event.target.value)
    );
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "ArrowUp") {
      event.preventDefault();
      setReadTime((time) => {
        if (time - 50 >= 50) return time - 50;
        return 50;
      });
    }
    if (event.code === "ArrowDown") {
      event.preventDefault();
      setReadTime((time) => {
        if (time + 50 < 1500) return time + 50;
        return 1500;
      });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  const handleButtonClick = () => {
    if (wordIndex + 1 === words.length) setWordIndex(0);

    setIsPlaying((playing) => !playing);
  };
  return (
    <main className="p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <TextField
          onChange={(e) => setInput(e.target.value)}
          value={input}
          label="Stuff to read"
          multiline
          rows={12}
          fullWidth
        />
      </div>
      <span>How fast do you want to read?</span>
      <div className="flex gap-3 items-center justify-center">
        <Slider
          min={50}
          max={1500}
          step={5}
          value={typeof readTime === "number" ? readTime : 150}
          onChange={(_, value) => {
            if (typeof value === "number") setReadTime(value);
          }}
          aria-labelledby="input-slider"
        />
        <Input
          value={readTime}
          size="small"
          onChange={handleInputChange}
          renderSuffix={() => "ms"}
          inputProps={{
            min: 50,
            max: 1500,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
      </div>

      <div className="flex items-center justify-center flex-col px-52 py-5 bg-slate-700 rounded-lg">
        <span className="text-neutral-100 font-bold text-xl">
          {words[wordIndex]}
        </span>
      </div>
      <Button onClick={handleButtonClick} variant="contained">
        {isPlaying ? "pause" : "play"}
      </Button>
    </main>
  );
}

export default App;
