
import React from "react";
import Notes from "./Notes";

export default function Home(props) {
  const {showAlert}=props;
  return (
    <div>
      <h1>NOTEITUP - Keep your notes on the cloud</h1>
      
      <Notes showAlert={showAlert}></Notes>
     
    </div>
  );
}
