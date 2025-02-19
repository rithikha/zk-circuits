
import { compile, createFileManager } from "@noir-lang/noir_wasm"

import main from "./circuit/src/main.nr?url";
import nargoToml from "./circuit/Nargo.toml?url";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';

export async function getCircuit() {
    const fm = createFileManager("/");
    const { body } = await fetch(main);
    const { body: nargoTomlBody } = await fetch(nargoToml);

    fm.writeFile("./src/main.nr", body);
    fm.writeFile("./Nargo.toml", nargoTomlBody);
    return await compile(fm);
}


const show = (id, content) => {
    const container = document.getElementById(id);
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};

document.getElementById("submit").addEventListener("click", async () => {
    try {
        //noir code
    } catch {
        show("logs", "Sorry");
    }
});


