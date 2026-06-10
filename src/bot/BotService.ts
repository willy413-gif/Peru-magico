export function narrar(
  texto: string,
  idioma = "es-PE",
  onEnd?: () => void,
) {
  speechSynthesis.cancel();

  const voz =
    new SpeechSynthesisUtterance(texto);

  voz.lang = idioma;

  voz.onend = () => {
    onEnd?.();
  };

  speechSynthesis.speak(voz);
}