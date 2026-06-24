export interface Cancion {
  id: number;
  nombre: string;
  video: string;
  audioQuechua: string;

}

export const canciones: Cancion[] = [

  {

    id: 1,
    nombre: "vaca lola",
    video: "/canciones-videos/vaca-lola.mp4",
    audioQuechua: "/canciones-audios/vaca-lola.mp3",

  },

  {

    id: 2,
    nombre: "Pollitos Dicen",
    video: "/canciones-videos/pollitos-dicen.mp4",
    audioQuechua: "/canciones-audios/pollitos-dicen.mp3",


  },

  {

    id: 3,
    nombre: "Estrellita Donde Estas",
    video: "/canciones-videos/estrellita.mp4",
    audioQuechua: "/canciones-audios/estrellita.mp3",
  }

];