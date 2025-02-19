import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

import main from "./src/main.nr?url";
import nargoToml from "./Nargo.toml?url";

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
        // noir goes here
        const { program } = await getCircuit();
        const noir = new Noir(program);
        const backend = new UltraHonkBackend(program.bytecode);
        const age = document.getElementById("age").value;
        show("logs", "Generating witness...");
        const { witness } = await noir.execute({ age });
        show("logs", "WITNESS GENERATED");
        show("logs", "Generating proof...");
        const proof = await backend.generateProof(witness);
        show("logs", "PROOF GENERATED");
        show("results", proof.proof);
        show("logs", "Verifying proof...");
        const isValid = await backend.verifyProof(proof);
        show("logs", `Proof is ${isValid ? "VALID" : "INVALID"}`);
    } catch (err) {
        console.error(err);
        show("logs", "Sorry, You are not a valid age");
    }
});