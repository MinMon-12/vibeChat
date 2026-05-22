import { useState } from "react";

const SystemSelect=({ selectedSystem, handleSystemChange }) => {
  const systems = [
        { label: "Assistant", key: "Assistant" },
        { label: "Chaotic Wizard", key: "ChaoticWizard" },
        { label: "LOML", key: "SweetCaringPartner" },
        { label: "Rapstar", key: "HipHopRapper" },
        { label: "GEN - Z", key: "CoolKid" }
    ];

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
        {/* Selected Button */}
        <button type="button" className="drop-shadow-xl/50 px-8 py-1 rounded-full text-black text-sm font-semibold
                           bg-white backdrop-blur-md border border-white/50
                           shadow-lg hover:bg-white/40 transition" onClick={() => setOpen(!open)}>
            {systems.find(s => s.key === selectedSystem)?.label}
        </button>

        {/* Dropdown Menu */}
        {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56
            bg-white/20 backdrop-blur-md
            rounded-2xl overflow-hidden shadow-xl border border-white/30 z-50">
            {systems.map((item) => (
            <button key={item.key} className="w-full py-3 text-black text-sm
                                            hover:bg-white/30 hover:backdrop-blur-lg
                                            transition border-b border-white/20" 
                                            onClick={() => {handleSystemChange(item.key); setOpen(false);}}>
                {item.label}
            </button>
            ))}
        </div>
        )}
    </div>
  );
}

export default SystemSelect;
