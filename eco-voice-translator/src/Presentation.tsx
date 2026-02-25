import { startTransition } from "react";
import Translation from "./Translation";
import "./Presentation.css";

type PresentationProps = {
  onStart: () => void;
};
 
function Presentation({ onStart }: PresentationProps){

 return   <>
 <div className="presentation-page">
    <div className="presentation-content">
 <h1>L’IA qui parle, mais à quel prix pour la planète ?</h1>
 <p>  Eco-Voice est né d'une question simple : quel est le prix physique d'une traduction virtuelle ? Mon application ne se contente pas de traduire votre voix ; elle analyse l'effort énergétique requis pour chaque mot prononcé. En connectant les algorithmes de pointe (OpenAI) à des modèles de données environnementales, Eco-Voice transforme une interaction invisible en une prise de conscience concrète. »</p>
 <button  onClick={onStart} >Commencer la traduction</button>
</div>
  </div>

</>
 
} export default Presentation;
