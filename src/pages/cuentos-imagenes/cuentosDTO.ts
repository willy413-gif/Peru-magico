export interface Escena {
  imagen: string;          // ruta en /public/cuentos/{region}/{n}.png
  texto_es: string;        // fragmento narrado en español
  texto_qu: string;        // fragmento narrado en quechua
}

export interface Cuento {
  id: string;
  region: "costa" | "sierra" | "selva";
  regionLabel: string;
  titulo: string;
  pistas: string;
  escenas: Escena[];       // siempre 4
}

export const CUENTOS: Cuento[] = [
  {
    id: "costa",
    region: "costa",
    regionLabel: "🌊 Costa",
    titulo: "Pelícano Pepe y su balsa de espuma",
    pistas: "Hay mar, olas, playa y arena.",
    escenas: [
      {
        imagen: "/cuentos/costa/1.png",
        texto_es: "El pelícano Pepe vive donde la arena es calientita y el agua es salada.",
        texto_qu: "Pelícano Pepeqa qhasqa allpapi, qachi unupi tiyan.",
      },
      {
        imagen: "/cuentos/costa/2.png",
        texto_es: "A Pepe le encanta volar sobre las olas del mar y saludar a los cangrejos que caminan de costado en la playa.",
        texto_qu: "Pepeqa mama qucha pawaqta munan, chaymantapas mayllaqkunata napaykuyta munan.",
      },
      {
        imagen: "/cuentos/costa/3.png",
        texto_es: "Hoy, Pepe encontró un pececito brillante y se lo guardó en su gran pico.",
        texto_qu: "Kunan, Pepeqa huk challwacha k'anchayta tariykun, sinqanpi waqaychaykun.",
      },
      {
        imagen: "/cuentos/costa/4.png",
        texto_es: "Después se sentó a mirar el sol comerse un helado en el horizonte.",
        texto_qu: "Chaymanta tiyaykun, intita qhawaspa, qucha patapi chinkaykuqta.",
      },
    ],
  },
  {
    id: "sierra",
    region: "sierra",
    regionLabel: "⛰️ Sierra",
    titulo: "La vicuñita Vicky y su chompa de lana",
    pistas: "Hay montañas altas, cerros, hace frío y el personaje tiene lana.",
    escenas: [
      {
        imagen: "/cuentos/sierra/1.png",
        texto_es: "Vicky es una vicuñita de ojos grandes que vive muy, muy alto, donde las montañas tocan las nubes.",
        texto_qu: "Vicky huk hatun ñawi vicuñacha, anchata hanaqpi, urqukuna phuyuwan tupanankupi tiyan.",
      },
      {
        imagen: "/cuentos/sierra/2.png",
        texto_es: "En su casa hace un frío que hace tiritar los dientes, pero Vicky no se preocupa porque tiene un abrigo de lana muy suave.",
        texto_qu: "Wasinpi anchata chiriyan, ichaqa Vickyqa mana llakikunchu, millwa p'achanwan kawsan.",
      },
      {
        imagen: "/cuentos/sierra/3.png",
        texto_es: "Hoy, Vicky saltó de roca en roca por los cerros.",
        texto_qu: "Kunan, Vickyqa rumimanta rumiman urqukunapi phinkimun.",
      },
      {
        imagen: "/cuentos/sierra/4.png",
        texto_es: "Y tomó agua fría de una laguna que parecía un espejo.",
        texto_qu: "Chaymantapas chiri unuta upyan, huk quchamanta qhawana hina.",
      },
    ],
  },
  {
    id: "selva",
    region: "selva",
    regionLabel: "🌿 Selva",
    titulo: "El monito Tito y el árbol gigante",
    pistas: "Hay mucha lluvia, color verde y el personaje vive en un árbol.",
    escenas: [
      {
        imagen: "/cuentos/selva/1.png",
        texto_es: "El monito Tito vive en un lugar donde siempre llueve y todo es de color verde.",
        texto_qu: "K'usillu Titoqa huk law, maypi tukuy kaq paramuq, qumir kaq, tiyan.",
      },
      {
        imagen: "/cuentos/selva/2.png",
        texto_es: "Su casa es un árbol gigante lleno de hojas y frutas ricas.",
        texto_qu: "Wasinqa huk hatun sach'a, raphikunawan miski ruru nakwan hunt'asqa.",
      },
      {
        imagen: "/cuentos/selva/3.png",
        texto_es: "A Tito le encanta colgarse de su cola y saltar de rama en rama mientras saluda a los loros de muchos colores.",
        texto_qu: "Titoqa chupanwan warkukuyta munan, ramanmanta ramanman phinkispa, achkha colorniyuq parlaqkunata napaykuspa.",
      },
      {
        imagen: "/cuentos/selva/4.png",
        texto_es: "Hoy, Tito encontró un plátano dulce y se lo comió haciendo: ¡Uju, aja!",
        texto_qu: "Kunan, Titoqa huk miski platanota tarikun, mikhurqun: ¡Uju, aja! nispa.",
      },
    ],
  },
];