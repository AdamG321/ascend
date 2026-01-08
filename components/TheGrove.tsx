
import React, { useState, useEffect } from 'react';
import { UserData } from '../types';

interface TheGroveProps {
  streak: number;
  ecosystem: UserData['ecosystem'];
}

const FOREST_STAGES = [
  "1V7zeM9q_fJZt1H6-pFS0mV4EkdSU6T2W", "1D12ez8vc0e-IgmnMUiX-j7rjj4En7G4W", "1u7ITlabjALDLkAwh5w2fz776nqKWIdgc"
].map(id => `https://lh3.googleusercontent.com/d/${id}`);

const TheGrove: React.FC<TheGroveProps> = ({ streak }) => {
  const milestone = Math.min(Math.floor(streak / 10), FOREST_STAGES.length - 1);
  const currentImageUrl = FOREST_STAGES[milestone];

  return (
    <div className="flex flex-col items-center p-4 space-y-8 animate-fade-in pb-28">
      <h2 className="cinzel text-4xl font-bold text-emerald-500">{streak} Napos Éden</h2>
      <div className="relative w-full aspect-[4/5] max-w-[420px] bg-[#050d0a] rounded-[4rem] border-[6px] border-slate-900 shadow-2xl overflow-hidden">
        <img src={currentImageUrl} alt="Forest" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default TheGrove;
