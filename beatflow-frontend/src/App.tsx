import AudioPlayer from "./components/AudioPlayer";
import PlayerBar from "./components/PlayerBar";
import AppRouter from "./router/AppRouter";

export default function App() {
  return <>
    <AppRouter />
    <AudioPlayer />
    <PlayerBar />
  </>;
}
